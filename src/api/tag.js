import myrequest from '@/utils/request'

/**
 * 标签相关API
 */

// 获取所有标签
export const getAllTags = () => {
  return myrequest.get('/tags')
}

// 添加标签
export const addTag = (name) => {
  return myrequest.post('/tags', { name })
}

// 删除标签
export const deleteTag = (tagId) => {
  return myrequest.delete(`/tags/${tagId}`)
}

// 🔴 绑定标签到服务器
// 后端API: POST /server/{serverId}/tags
// 请求体: { tagIds: [1, 2, 3] } - 标签ID数组
export const bindTagsToServer = (serverId, tagIds) => {
  return myrequest.post(`/server/${serverId}/tags`, { tagIds })
}

// 🔴 获取服务器的标签
// 后端API: GET /server/{serverId}/tags
// 返回: [{ id: 1, name: "标签1" }, { id: 2, name: "标签2" }]
export const getServerTags = (serverId) => {
  return myrequest.get(`/server/${serverId}/tags`)
}

// 🔴 解绑服务器的标签
// 后端API: DELETE /server/{serverId}/tags/{tagId}
export const unbindTagFromServer = (serverId, tagId) => {
  return myrequest.delete(`/server/${serverId}/tags/${tagId}`)
}

