# 🎮 L4D2 服务器管理系统

<div align="center">

一个现代化的求生之路2（Left 4 Dead 2）服务器查询和管理系统前端应用

[![Vue](https://img.shields.io/badge/Vue-3.4.29-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.8.6-409EFF?style=flat-square&logo=element)](https://element-plus.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3.1-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

</div>

---

## ✨ 功能特性

### 🎯 核心功能
- **服务器管理** - 添加、删除、刷新服务器信息
- **实时查询** - 查询服务器状态、地图、玩家数量
- **玩家信息** - 查看服务器当前在线玩家列表
- **标签筛选** - 通过标签快速筛选和分类服务器
- **一键连接** - 自动复制服务器连接指令
- **服务器浏览** - 从 Steam Master Server 搜索和添加服务器

### 🎨 界面特性
- 🌈 现代化渐变紫色主题
- 📱 完全响应式设计，支持移动端
- ✨ 流畅的动画和过渡效果
- 🎯 直观的卡片式布局
- 🔍 实时搜索和筛选
- 💫 优雅的空状态提示

### 🛠️ 管理功能
- 📊 服务器自动分类
- 🗑️ 清理无效服务器
- 🏷️ 标签管理系统
- ⏰ 连接时间追踪
- 🔄 批量操作支持

---

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 16.0.0
- **pnpm**: >= 8.0.0 (推荐) 或 npm

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 开发运行

```bash
# 启动开发服务器 (带 host 模式)
pnpm dev

# 访问地址
# 本地: http://localhost:5173
# 网络: http://[your-ip]:5173
```

### 生产构建

```bash
# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

---

## 📦 技术栈

### 核心框架
- **[Vue 3](https://vuejs.org/)** - 渐进式 JavaScript 框架
- **[Vite](https://vitejs.dev/)** - 下一代前端构建工具
- **[Vue Router](https://router.vuejs.org/)** - 官方路由管理器
- **[Pinia](https://pinia.vuejs.org/)** - Vue 官方状态管理库

### UI 组件库
- **[Element Plus](https://element-plus.org/)** - 基于 Vue 3 的组件库
- **[Element Plus Icons](https://element-plus.org/en-US/component/icon.html)** - 图标库
- **[Ant Design Vue](https://antdv.com/)** - 企业级 UI 组件库（部分功能）

### 工具库
- **[Axios](https://axios-http.com/)** - HTTP 客户端
- **[Clipboard.js](https://clipboardjs.com/)** - 剪贴板操作
- **[Sass](https://sass-lang.com/)** - CSS 预处理器
- **[Tailwind CSS](https://tailwindcss.com/)** - 实用优先的 CSS 框架

---

## 📁 项目结构

```
l4d2serverquery-frontend/
├── public/                 # 静态资源
│   └── favicon.ico
├── src/
│   ├── api/               # API 接口
│   │   └── tag.js
│   ├── assets/            # 资源文件
│   │   ├── base.css
│   │   ├── main.css
│   │   └── logo.svg
│   ├── components/        # 通用组件
│   │   ├── TagComponent.vue
│   │   └── icons/         # 图标组件
│   ├── router/            # 路由配置
│   │   └── index.js
│   ├── stores/            # 状态管理
│   │   └── counter.js
│   ├── utils/             # 工具函数
│   │   ├── request.js     # Axios 封装
│   │   └── mymock.js      # Mock 数据
│   ├── views/             # 页面视图
│   │   ├── TableView.vue           # 服务器列表
│   │   ├── AddServerView.vue       # 添加服务器
│   │   ├── TagView.vue             # 标签筛选
│   │   ├── TestView.vue            # 调试工具
│   │   ├── FindServerView.vue      # 服务器浏览器
│   │   └── ...
│   ├── App.vue            # 根组件
│   └── main.js            # 应用入口
├── index.html             # HTML 模板
├── vite.config.js         # Vite 配置
├── package.json           # 项目配置
└── README.md              # 项目文档
```

---

## 🎯 主要功能说明

### 1️⃣ 服务器列表管理

- **查询服务器**: 根据关键字和标签筛选服务器
- **服务器信息**: 显示地址、名称、地图、玩家数量
- **状态标签**: 
  - 🟢 推荐连接 - 超过5分钟未连接
  - 🟡 最近已连 - 5分钟内已连接过
- **操作按钮**:
  - 📋 复制 - 复制连接指令到剪贴板
  - 👥 玩家 - 查看当前在线玩家
  - 🔄 刷新 - 更新服务器信息
  - 🗑️ 删除 - 移除服务器

### 2️⃣ 添加服务器

- 输入格式: `IP:PORT` (例如: `192.168.1.1:27015`)
- 自动验证和添加
- 支持批量添加（通过服务器浏览器）

### 3️⃣ 标签筛选系统

- 多标签选择筛选
- 动态标签管理
- 自动分类功能
- 空状态友好提示

### 4️⃣ 服务器浏览器

- 从 Steam Master Server 搜索服务器
- 显示玩家状态和地图信息
- 支持关键字搜索
- 分页显示结果
- 一键添加到管理列表

---

## 🎨 界面展示

### 主界面
- 渐变紫色背景
- 三个主要卡片区域：
  1. **筛选与管理** - 标签选择和管理操作
  2. **添加服务器** - 快速添加服务器
  3. **服务器列表** - 表格显示所有服务器

### 交互动画
- 卡片悬停效果
- 按钮动画反馈
- 平滑的页面过渡
- 自定义滚动条样式

---

## 🔧 配置说明

### API 基础地址

在 `src/utils/request.js` 中配置后端 API 地址：

```javascript
const baseURL = 'http://your-backend-api:port'
```

### 路由模式

项目使用 Hash 路由模式，无需服务器配置即可运行。

### 开发模式

在 `vite.config.js` 中可以配置代理、端口等：

```javascript
export default defineConfig({
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://backend-server',
        changeOrigin: true
      }
    }
  }
})
```

---

## 🔨 开发相关

### 代码规范

- 使用 Vue 3 Composition API
- TypeScript 类型标注（部分文件）
- SCSS 模块化样式
- ESLint + Prettier 代码格式化

### 推荐的 IDE 设置

- **VSCode** + **Volar** 插件
- 禁用 Vetur（与 Volar 冲突）

### 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

---

## 📝 更新日志

### v2.0.0 (2025-10-17)

#### 🎉 重大更新
- ✅ 从 lew-ui 迁移到 Element Plus
- 🎨 全新现代化 UI 设计
- 📱 完善的响应式布局

#### ✨ 新增功能
- 空状态提示
- 服务器浏览器优化
- 弹窗高度自适应
- 输入框尺寸优化

#### 🐛 Bug 修复
- 修复弹窗被卡片限制的问题
- 优化表格滚动性能
- 改进消息提示体验

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交规范

```bash
# 功能开发
git commit -m "feat: 添加新功能"

# Bug 修复
git commit -m "fix: 修复某个问题"

# 文档更新
git commit -m "docs: 更新文档"

# 样式调整
git commit -m "style: 调整样式"

# 代码重构
git commit -m "refactor: 重构代码"
```

---

## 📄 许可证

[MIT License](LICENSE)

---

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 优秀的前端框架
- [Element Plus](https://element-plus.org/) - 精美的组件库
- [Vite](https://vitejs.dev/) - 快速的构建工具
- Steam 社区 - L4D2 服务器支持

---

## 📮 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 📧 Email: [your-email@example.com]
- 💬 Issues: [GitHub Issues](https://github.com/your-username/l4d2serverquery-frontend/issues)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，欢迎 Star ⭐**

Made with ❤️ by [claude-4.5-sonnet]. Thank you!

</div>
