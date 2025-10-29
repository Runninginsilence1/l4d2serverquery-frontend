# 服务器标签绑定 - 后端API参考

本文档提供了服务器标签绑定功能所需的后端API接口设计参考。

## API 接口列表

### 1. 绑定标签到服务器

**接口说明**: 将多个标签绑定到指定服务器

**请求方式**: `POST`

**请求路径**: `/server/{serverId}/tags`

**路径参数**:
- `serverId`: 服务器ID (整数)

**请求体** (JSON):
```json
{
  "tagIds": [1, 2, 3]
}
```

**字段说明**:
- `tagIds`: 要绑定的标签ID数组，可以是空数组（表示清空所有标签）

**响应示例**:

成功 (200):
```json
{
  "message": "标签绑定成功",
  "data": null
}
```

失败 (400):
```json
{
  "message": "服务器不存在或标签ID无效",
  "error": "详细错误信息"
}
```

**实现建议**:
- 建议使用"替换"策略：先删除服务器的所有现有标签，再添加新的标签
- 可以使用事务确保数据一致性
- 验证所有tagId是否存在于数据库中

---

### 2. 获取服务器的标签

**接口说明**: 获取指定服务器已绑定的所有标签

**请求方式**: `GET`

**请求路径**: `/server/{serverId}/tags`

**路径参数**:
- `serverId`: 服务器ID (整数)

**响应示例**:

成功 (200):
```json
[
  {
    "id": 1,
    "name": "高质量服务器"
  },
  {
    "id": 2,
    "name": "活跃社区"
  }
]
```

失败 (404):
```json
{
  "message": "服务器不存在",
  "error": "详细错误信息"
}
```

---

### 3. 解绑服务器的标签

**接口说明**: 从服务器解绑指定的单个标签

**请求方式**: `DELETE`

**请求路径**: `/server/{serverId}/tags/{tagId}`

**路径参数**:
- `serverId`: 服务器ID (整数)
- `tagId`: 标签ID (整数)

**响应示例**:

成功 (200):
```json
{
  "message": "标签解绑成功"
}
```

失败 (404):
```json
{
  "message": "服务器或标签不存在"
}
```

**注意**: 这个接口是可选的，如果使用"替换"策略，可以不实现此接口。

---

### 4. 修改服务器列表接口 (重要!)

**接口说明**: 需要修改现有的 `/serverList/v2` 接口，在返回的服务器数据中包含标签信息

**请求方式**: `POST`

**请求路径**: `/serverList/v2`

**请求体** (保持原样):
```json
{
  "name": "搜索关键字",
  "tags": [1, 2]
}
```

**响应示例** (需要修改):
```json
[
  {
    "id": 24,
    "address": "106.54.61.52:25444",
    "serverName": "示例服务器",
    "map": "c8m5_rooftop",
    "onlinePlayers": 8,
    "maxPlayers": 12,
    "lastQueryTimeString": "2024-11-17 15:58:27",
    "tags": [
      {
        "id": 1,
        "name": "高质量服务器"
      },
      {
        "id": 2,
        "name": "活跃社区"
      }
    ]
  }
]
```

**关键修改**:
- 在每个服务器对象中添加 `tags` 字段
- `tags` 是一个数组，包含该服务器绑定的所有标签对象
- 如果服务器没有绑定标签，`tags` 应该是空数组 `[]`

---

## 数据库设计建议

### 服务器-标签关联表 (server_tag)

```sql
CREATE TABLE server_tag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    server_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (server_id) REFERENCES server(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE,
    UNIQUE KEY unique_server_tag (server_id, tag_id)
);
```

**说明**:
- `UNIQUE KEY` 确保同一个服务器不会重复绑定同一个标签
- `ON DELETE CASCADE` 确保删除服务器或标签时，关联记录也会被删除

---

## 实现示例 (伪代码)

### 绑定标签到服务器

```java
// Spring Boot 示例
@PostMapping("/server/{serverId}/tags")
public ResponseEntity<?> bindTagsToServer(
    @PathVariable Long serverId,
    @RequestBody TagBindRequest request
) {
    // 1. 验证服务器是否存在
    Server server = serverRepository.findById(serverId)
        .orElseThrow(() -> new NotFoundException("服务器不存在"));
    
    // 2. 验证所有标签ID是否有效
    List<Tag> tags = tagRepository.findAllById(request.getTagIds());
    if (tags.size() != request.getTagIds().size()) {
        throw new BadRequestException("部分标签ID无效");
    }
    
    // 3. 删除现有绑定关系
    serverTagRepository.deleteByServerId(serverId);
    
    // 4. 创建新的绑定关系
    List<ServerTag> serverTags = request.getTagIds().stream()
        .map(tagId -> new ServerTag(serverId, tagId))
        .collect(Collectors.toList());
    serverTagRepository.saveAll(serverTags);
    
    return ResponseEntity.ok(Map.of("message", "标签绑定成功"));
}
```

### 获取服务器的标签

```java
@GetMapping("/server/{serverId}/tags")
public ResponseEntity<List<Tag>> getServerTags(@PathVariable Long serverId) {
    // 1. 验证服务器是否存在
    Server server = serverRepository.findById(serverId)
        .orElseThrow(() -> new NotFoundException("服务器不存在"));
    
    // 2. 查询服务器的所有标签
    List<Tag> tags = tagRepository.findByServerId(serverId);
    
    return ResponseEntity.ok(tags);
}
```

### 修改服务器列表接口

```java
@PostMapping("/serverList/v2")
public ResponseEntity<List<ServerDTO>> getServerList(@RequestBody ServerQueryRequest request) {
    // 原有的查询逻辑...
    List<Server> servers = serverRepository.findByNameAndTags(
        request.getName(), 
        request.getTags()
    );
    
    // 关键：为每个服务器加载标签信息
    List<ServerDTO> serverDTOs = servers.stream()
        .map(server -> {
            ServerDTO dto = convertToDTO(server);
            // 查询并设置标签
            List<Tag> tags = tagRepository.findByServerId(server.getId());
            dto.setTags(tags);
            return dto;
        })
        .collect(Collectors.toList());
    
    return ResponseEntity.ok(serverDTOs);
}
```

---

## 前端使用说明

前端已经实现了完整的UI功能：

1. **查看标签**: 在服务器列表的"标签"列中显示已绑定的标签
2. **绑定标签**: 点击操作栏的"标签"按钮，打开对话框选择标签
3. **多选标签**: 可以同时选择多个标签绑定到服务器
4. **自动刷新**: 绑定成功后会自动刷新服务器列表

---

## 测试建议

1. 测试绑定单个标签
2. 测试绑定多个标签
3. 测试清空所有标签（传空数组）
4. 测试无效的服务器ID
5. 测试无效的标签ID
6. 测试重复绑定同一个标签
7. 测试删除标签后，服务器的标签显示是否正确
8. 测试删除服务器后，关联记录是否正确清理

---

## 注意事项

1. **性能优化**: 如果服务器数量很多，建议使用JOIN查询或批量查询来避免N+1问题
2. **事务处理**: 绑定标签时建议使用事务，确保数据一致性
3. **权限控制**: 根据需要添加权限验证，确保只有授权用户可以修改服务器标签
4. **日志记录**: 建议记录标签绑定/解绑操作的日志，便于追踪



