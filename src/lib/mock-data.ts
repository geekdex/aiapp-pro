import { Category, SystemConfig, Tool } from '@/types';

export const FALLBACK_SYSTEM_CONFIG: SystemConfig = {
  icpNo: '黔ICP备2024030886号-1',
  icpUrl: 'https://beian.miit.gov.cn/',
  psbNo: '贵公网安备52263202522683号',
  psbUrl: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=52263202522683',
  siteName: 'AIAPP.PRO',
  siteUrl: 'https://aiapp.pro',
  siteDescription: '全球前沿 AI 工具导航与深度实战指南社区',
};

export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 1,
    model_id: 1,
    system_id: 'aiapp',
    model_slug: 'categories',
    data: { name: '写作与翻译', slug: 'writer-ai', sort_order: 1 },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    model_id: 1,
    system_id: 'aiapp',
    model_slug: 'categories',
    data: { name: '编程与开发', slug: 'ai-programming', sort_order: 2 },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    model_id: 1,
    system_id: 'aiapp',
    model_slug: 'categories',
    data: { name: '图像与创意', slug: 'image-ai', sort_order: 3 },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    model_id: 1,
    system_id: 'aiapp',
    model_slug: 'categories',
    data: { name: '智能体与Agent', slug: 'ai-agents', sort_order: 4 },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    model_id: 1,
    system_id: 'aiapp',
    model_slug: 'categories',
    data: { name: '视频生成与编辑', slug: 'video-ai', sort_order: 5 },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 6,
    model_id: 1,
    system_id: 'aiapp',
    model_slug: 'categories',
    data: { name: '办公与知识管理', slug: 'productivity-ai', sort_order: 6 },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 7,
    model_id: 1,
    system_id: 'aiapp',
    model_slug: 'categories',
    data: { name: '对话与通用模型', slug: 'ai-chat-assistant', sort_order: 7 },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 8,
    model_id: 1,
    system_id: 'aiapp',
    model_slug: 'categories',
    data: { name: '音频与音乐', slug: 'audio-ai', sort_order: 8 },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 9,
    model_id: 1,
    system_id: 'aiapp',
    model_slug: 'categories',
    data: { name: 'AI 搜索与研究', slug: 'search-ai', sort_order: 9 },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const FALLBACK_TOOLS: Tool[] = [
  {
    id: 101,
    model_id: 2,
    system_id: 'aiapp',
    model_slug: 'tools',
    data: {
      title: 'DeepSeek R1',
      slug: 'deepseek-r1',
      category_id: 7,
      website_url: 'https://chat.deepseek.com',
      logo: 'https://cdn.oaistatic.com/_next/static/media/apple-touch-icon.59fc0d18.png',
      badge: '开源推理最强',
      badgeColor: '#0ea5e9',
      description:
        '深度求索全新开源第一代推理模型，数学、代码和自然语言推理能力比肩 OpenAI o1 正式版，支持全流程思维链透明展示。',
      tutorial: `## 1. 核心特性与简介
DeepSeek-R1 是由深度求索自主研发的开源推理大模型。通过大规模强化学习（RL）训练，模型具备自我反思、长思维链推理、复杂逻辑推导等能力，在 MATH-500、AIME 2024 以及 Codeforces 等高难度基准评测中达到了顶尖水平。

### 为什么选择 DeepSeek-R1？
- **深度思维链透明化**：完整呈现推导过程，能够回溯逻辑分支与自我校验。
- **开源可商用**：权重开源，支持本地部署（Ollama、vLLM）与私有化微调。
- **极高性价比**：API 调用成本仅为同类闭源模型的极小比例。

## 2. 快速上手配置
### 在线体验
访问官方网页端 [chat.deepseek.com](https://chat.deepseek.com)，勾选 **“深度思考 (R1)”** 模式即可开启思维链体验。

### 本地私有化运行
如果你拥有本地显卡或 Mac Apple Silicon 设备，可以使用 Ollama 一键启动量化版本：

\`\`\`bash
# 启动 7B 蒸馏版
ollama run deepseek-r1:7b

# 启动 32B 高性能蒸馏版
ollama run deepseek-r1:32b
\`\`\`

## 3. 实战工作流演练
与传统语言模型不同，DeepSeek-R1 擅长处理**多步推理、复杂算法推导以及长文本逻辑校对**。

### 实战示例：复杂业务架构方案设计
> 输入提示词：请帮我设计一个跨国电商的防高并发超卖库存架构，分析 Redis Lua 脚本与数据库乐观锁的利弊，并给出伪代码与故障容灾预案。

在生成回答前，模型会进入深度思考阶段，展示思考步骤：
1. 梳理业务核心瓶颈与网络时延
2. 分析 Redis 强一致扣减与异步持久化策略
3. 构建 Lua 脚本原子原子操作保障
4. 输出带异常回滚机制的完整方案代码

## 4. 专家高阶提示词与技巧
- **无需过度 Prompt 工程**：R1 具有自主发散与收敛能力，直接陈述真实痛点和约束条件往往效果最佳。
- **指定思考深度**：可以在提示词结尾加上“请优先从数学概率和最坏时间复杂度角度进行论证”。`,
    },
    created_at: '2024-05-10T12:00:00Z',
    updated_at: '2024-05-10T12:00:00Z',
  },
  {
    id: 102,
    model_id: 2,
    system_id: 'aiapp',
    model_slug: 'tools',
    data: {
      title: 'Cursor AI',
      slug: 'cursor-ai',
      category_id: 2,
      website_url: 'https://cursor.com',
      logo: 'https://www.cursor.com/brand/icon.svg',
      badge: 'AI 编程神器',
      badgeColor: '#6366f1',
      description:
        '基于 VS Code 构建的下一代 AI 原生代码编辑器。支持全代码库索引、多文件联动编辑 Composer 与智能代码续写。',
      tutorial: `## 1. 核心特性与简介
Cursor 是当下全球开发者最推崇的 AI 原生编辑器，完美兼容 VS Code 插件生态，同时内置深度结合项目的代码理解能力。

### 核心亮点
- **Composer (Cmd+I)**：跨文件智能生成与批量重构。
- **全代码库感知 (@Codebase)**：基于向量检索深度理解你的项目上下文与依赖。
- **Copilot++ 预测续写**：根据光标移动与历史改动，提前预测下一步代码输入。

## 2. 快速上手配置
1. 前往官网下载对应操作系统的客户端。
2. 打开现有代码库，在设置中启用 **Indexing Codebase**。
3. 绑定模型提供商（可使用 Cursor 内置模型，也可配置自身 API Key）。

## 3. 典型实战演练：重构前端组件
在任意项目中按下 \`Cmd + I\` 打开 Composer：
\`\`\`text
@src/components/ToolCard.tsx 请为卡片添加平滑的微交互动画，支持悬浮发光边框，并兼容深色模式无障碍对比度。
\`\`\`
Cursor 会精准圈定修改区域，并生成前后对比 Diff，用户按 \`Accept\` 即可一次性应用所有文件改动。`,
    },
    created_at: '2024-05-10T12:00:00Z',
    updated_at: '2024-05-10T12:00:00Z',
  },
  {
    id: 103,
    model_id: 2,
    system_id: 'aiapp',
    model_slug: 'tools',
    data: {
      title: 'Claude 3.7 Sonnet',
      slug: 'claude-3-7-sonnet',
      category_id: 7,
      website_url: 'https://claude.ai',
      logo: 'https://claude.ai/favicon.ico',
      badge: '混合推理旗舰',
      badgeColor: '#d97706',
      description:
        'Anthropic 最新旗舰大模型，首创标准模式与长思考模式无缝切换，在编码、长上下文分析与系统设计中表现优异。',
      tutorial: `## 1. 核心特性与简介
Claude 3.7 Sonnet 具备前所未有的混合推理能力，既能以极快速度进行日常交互，又能在复杂工程中分配动态思考预算，生成工业级严谨代码。

### 核心优势
- **自适应思考预算**：用户可灵活控制模型思考 Token 数量。
- **业界最高代码质量**：在 SWE-bench Verified 评测中持续领跑。
- **200K 超长上下文窗口**：支持一次性注入数十万行代码或整本专业书籍。`,
    },
    created_at: '2024-05-10T12:00:00Z',
    updated_at: '2024-05-10T12:00:00Z',
  },
  {
    id: 104,
    model_id: 2,
    system_id: 'aiapp',
    model_slug: 'tools',
    data: {
      title: 'ChatGPT (GPT-4o)',
      slug: 'chatgpt',
      category_id: 7,
      website_url: 'https://chatgpt.com',
      logo: 'https://oaistatic-cdn.azureedge.net/chatgpt/favicon.ico',
      badge: '全能多模态',
      badgeColor: '#10b981',
      description:
        'OpenAI 旗舰全模态大模型，集文本、语音、视觉理解于一体，提供强大的实时联网搜索、GPTs 插件与代码解释器环境。',
      tutorial: `## 1. 核心特性与简介
ChatGPT 是全球知名度最高且功能最完善的 AI 助手之一，拥有覆盖全平台（Web、iOS、Android、macOS、Windows）的原生客户端。

### 核心功能
- **实时语音模式 (Advanced Voice)**：具有超低延迟和情感表现力的自然对谈。
- **内置 Python 沙箱执行器**：直接上传 Excel、CSV 或图像进行深度数据可视化。
- **Canvas 协作画布**：一边对话一边协同编辑文档与代码。`,
    },
    created_at: '2024-05-10T12:00:00Z',
    updated_at: '2024-05-10T12:00:00Z',
  },
  {
    id: 105,
    model_id: 2,
    system_id: 'aiapp',
    model_slug: 'tools',
    data: {
      title: 'v0 by Vercel',
      slug: 'v0-by-vercel',
      category_id: 2,
      website_url: 'https://v0.dev',
      logo: 'https://v0.dev/favicon.ico',
      badge: '全栈界面生成',
      badgeColor: '#000000',
      description:
        '基于 React、Tailwind CSS 与 Shadcn UI 的生成式前端开发工具，自然语言即刻生成高美感、可直接落地的生产级代码。',
      tutorial: `## 1. 核心特性与简介
v0 是 Vercel 倾力打造的 AI 界面生成平台，深刻融合了现代前端设计系统规范，生成具备无障碍支持、响应式布局的 React 组件。

### 为什么设计师与开发者喜爱 v0？
- **即时交互预览**：生成的 UI 可以直接在浏览器中点击交互。
- **一键复制代码**：直接导出到 Next.js 项目中，零样式依赖冲突。`,
    },
    created_at: '2024-05-10T12:00:00Z',
    updated_at: '2024-05-10T12:00:00Z',
  },
  {
    id: 106,
    model_id: 2,
    system_id: 'aiapp',
    model_slug: 'tools',
    data: {
      title: 'Midjourney v6.1',
      slug: 'midjourney',
      category_id: 3,
      website_url: 'https://www.midjourney.com',
      logo: 'https://www.midjourney.com/favicon.ico',
      badge: '电影级画质',
      badgeColor: '#ec4899',
      description:
        '全球顶尖 AI 艺术生成工具，在光影质感、写实人物细节、微距质感和设计审美领域无可匹敌，现已全面开放独立 Web 版。',
      tutorial: `## 1. 核心特性与简介
Midjourney 凭借其艺术级的光影把控和逼真的材质细节，成为广告设计、概念插画与创意视觉从业者的必备生产力工具。

### 提示词公式
\`\`\`text
[主体描述] + [场景环境] + [光影质感] + [镜头与视角] + [风格参数 --ar 16:9 --v 6.1 --s 250]
\`\`\``,
    },
    created_at: '2024-05-10T12:00:00Z',
    updated_at: '2024-05-10T12:00:00Z',
  },
  {
    id: 107,
    model_id: 2,
    system_id: 'aiapp',
    model_slug: 'tools',
    data: {
      title: 'Perplexity AI',
      slug: 'perplexity-ai',
      category_id: 9,
      website_url: 'https://www.perplexity.ai',
      logo: 'https://www.perplexity.ai/favicon.ico',
      badge: 'AI 搜索革命',
      badgeColor: '#14b8a6',
      description:
        '颠覆传统搜索引擎的答案引擎，提供带有学术与信源引用角标的精准结构化分析，支持 Pro Search 深度多步调研。',
      tutorial: `## 1. 核心特性与简介
Perplexity AI 将强大的大模型与实时网页索引相融，彻底摒弃传统搜索中充斥的广告与冗余链接，直接提供清晰带源引用的答案。`,
    },
    created_at: '2024-05-10T12:00:00Z',
    updated_at: '2024-05-10T12:00:00Z',
  },
  {
    id: 108,
    model_id: 2,
    system_id: 'aiapp',
    model_slug: 'tools',
    data: {
      title: 'Suno AI v4',
      slug: 'suno-ai',
      category_id: 8,
      website_url: 'https://suno.com',
      logo: 'https://suno.com/favicon.ico',
      badge: '音乐生成标杆',
      badgeColor: '#f43f5e',
      description:
        '只需几句歌词或风格描述，即可在数十秒内生成广播级音质、包含丰富编曲与人声合唱的完整歌曲，支持高清人声分离与微调。',
    },
    created_at: '2024-05-10T12:00:00Z',
    updated_at: '2024-05-10T12:00:00Z',
  },
  {
    id: 109,
    model_id: 2,
    system_id: 'aiapp',
    model_slug: 'tools',
    data: {
      title: 'Runway Gen-3 Alpha',
      slug: 'runway-gen3',
      category_id: 5,
      website_url: 'https://runwayml.com',
      logo: 'https://runwayml.com/favicon.ico',
      badge: '电影级视频',
      badgeColor: '#8b5cf6',
      description:
        '下一代高保真视频生成大模型，具备逼真的人体物理运动表现、精准的镜头运镜控制和细腻的光照氛围渲染。',
      tutorial: `## 1. 核心特性与简介
Runway Gen-3 Alpha 为好莱坞级影视创作者提供强大的文本生成视频（Text-to-Video）与图片驱动视频（Image-to-Video）能力。`,
    },
    created_at: '2024-05-10T12:00:00Z',
    updated_at: '2024-05-10T12:00:00Z',
  },
  {
    id: 110,
    model_id: 2,
    system_id: 'aiapp',
    model_slug: 'tools',
    data: {
      title: 'Kimi 智能助手',
      slug: 'kimi-moonshot',
      category_id: 1,
      website_url: 'https://kimi.moonshot.cn',
      logo: 'https://kimi.moonshot.cn/favicon.ico',
      badge: '超长文本解析',
      badgeColor: '#3b82f6',
      description:
        '月之暗面推出的长文本 AI 对话工具，支持无损解析 200 万字长文档、财报与论文，并具备强大的联网搜索与学术研究辅助功能。',
      tutorial: `## 1. 核心特性与简介
Kimi 是国内长上下文领域的标杆产品，无论是上百页的 PDF 研报、行业规范，还是长达数十集的视频字幕文本，均能秒级提取关键结论。`,
    },
    created_at: '2024-05-10T12:00:00Z',
    updated_at: '2024-05-10T12:00:00Z',
  },
  {
    id: 111,
    model_id: 2,
    system_id: 'aiapp',
    model_slug: 'tools',
    data: {
      title: 'Dify.ai',
      slug: 'dify-ai',
      category_id: 4,
      website_url: 'https://dify.ai',
      logo: 'https://dify.ai/favicon.ico',
      badge: '开源 Agent 平台',
      badgeColor: '#2563eb',
      description:
        '领先的开源大语言模型应用开发平台，融合可视化工作流、RAG 检索增强、Agent 插件与模型路由，助企业快速上线 AI 应用。',
      tutorial: `## 1. 核心特性与简介
Dify 提供了低代码/无代码可视化画布，让开发者与业务人员可以在几分钟内组装出工业级 RAG 知识库问答助手或自动化 Agent。`,
    },
    created_at: '2024-05-10T12:00:00Z',
    updated_at: '2024-05-10T12:00:00Z',
  },
  {
    id: 112,
    model_id: 2,
    system_id: 'aiapp',
    model_slug: 'tools',
    data: {
      title: 'Flux.1 by Black Forest Labs',
      slug: 'flux-1',
      category_id: 3,
      website_url: 'https://blackforestlabs.ai',
      logo: 'https://blackforestlabs.ai/favicon.ico',
      badge: '开源绘图巅峰',
      badgeColor: '#10b981',
      description:
        'Stable Diffusion 原班核心团队打造的 120 亿参数开源文生图模型，在文字排版还原、手指解剖结构及复杂提示词遵循度上全面超越现有模型。',
    },
    created_at: '2024-05-10T12:00:00Z',
    updated_at: '2024-05-10T12:00:00Z',
  },
];
