# AIAPP.PRO - 现代 AI 工具导航与实战指南 (Next.js SSR + EdgeOne)

基于 **Next.js 16 (App Router)** + **Tailwind CSS v4** + **TypeScript** 构建的现代化 AI 工具导航与深度实战指南应用，完美对接基于 **Foundry Rust** 单体模块化基建的 `aiapp` 业务子系统，支持部署于 **腾讯云 EdgeOne (边缘安全与加速平台 / EdgeOne Pages)**。

---

## 🌟 核心特性与亮点

1. **极致设计美学与视觉体验**：
   - 参考并大幅超越原 `NaviFlow` 主题，采用深色曜石黑金、玻璃拟态（Glassmorphism）、微渐变光晕与卡片悬浮动效。
   - 响应式设计：手机、平板、桌面端均有极佳的浏览交互体验。
2. **Google Codelabs 风格深度教程阅览器**：
   - 自动将工具 Markdown 文章按核心章节（概览、主要功能、快速上手、产品定价、适用人群）拆解为交互式 **多步学习工作流**。
   - 配备侧边栏大纲、阅读进度条、步骤完成对勾标记及「下一步」引导按钮。
3. **全局毫秒级搜索 (⌘K)**：
   - 支持键盘全局快捷键 `⌘K` / `Ctrl+K` 调出命令行式搜索抽屉。
   - 毫秒级模糊检索工具名称、详情描述、分类与标签。
4. **分类索引与直达导航**：
   - 涵盖 15 大精选分类（写作、图像、编程、智能体、音视频、模型训练等），自带动态数量统计。
   - 一键直达官方原站与深度教程页面无缝切换。
5. **高性能 SSR & Tencent EdgeOne 边缘友好**：
   - Next.js 服务端渲染（SSR）与 60s 增量静态再生成（ISR）。
   - 携带 `X-EdgeOne-Cache` 与 CDN 缓存头，天然契合 EdgeOne 全球边缘节点加速与缓存清洗。

---

## 🛠️ 项目工程脚本

```bash
# 安装依赖
pnpm install

# 启动本地开发热重载服务 (http://localhost:3000)
pnpm dev

# 代码格式化 (Prettier)
pnpm fmt

# TypeScript 强类型校验
pnpm typecheck

# 代码规范检查 (ESLint)
pnpm lint

# 生产环境编译构建
pnpm build

# 启动生产服务
pnpm start
```

---

## ⚙️ 环境变量配置 (.env)

```env
# API 服务端配置（包含完整路径）
API_URL=http://localhost:8080/api/s/aiapp
API_TOKEN=your_api_token_here
```

---

## 🚀 腾讯云 EdgeOne 部署与加速建议

1. **边缘节点缓存策略**：
   - 静态资源 (`/_next/static/*`, `/icons/*`)：EdgeOne 规则引擎建议设置缓存 **30 天**。
   - 动态 SSR 路由 (`/`, `/tool/*`)：EdgeOne 建议设置源站缓存遵循 `s-maxage=60`，边缘平滑刷新（Stale-While-Revalidate）。
2. **边缘缓存主动刷新 (Purge)**：
   - 当在 Foundry 后台新增或修改工具时，可通过 EdgeOne OpenAPI 触发 URL 或 Tag 刷新：
   - 接口：`PurgeUrlsCache` 刷新指定页面。
3. **安全防护**：
   - 开启 EdgeOne 基础 Web 防护模板，拦截高频爬虫与 SQL 注入 / XSS 恶意扫描。
