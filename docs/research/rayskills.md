# rayskills 技能包研究

研究日期：2026-07-21  
上游仓库：[imraywang/rayskills](https://github.com/imraywang/rayskills)  
固定快照：[454bff330bb3ddae9d3c639bd0f791e6c61dd830](https://github.com/imraywang/rayskills/commit/454bff330bb3ddae9d3c639bd0f791e6c61dd830)

## 研究结论

- `rayskills` 是面向 Claude Code、Codex 等 Agent 的 builder 工具箱，不是单一领域的 Skill。
- 当前 README 宣称 21 项 Skill：`/ray` 主路由加 20 个成员 Skill；仓库目录中找到 21 个 `skills/*/SKILL.md`。
- 官方安装命令为 `npx -y skills add imraywang/rayskills -g --all`，也支持按需安装单个成员。
- 官方仓库包含 `evals/evals.json`、`references/`、`scripts/` 和 `tools/build.sh` 等配套资产，不能只把 21 个名称当作简单命令目录。
- 仓库许可证为 CC BY-NC 4.0。Skills123 收录页必须保留署名、原仓库链接和非商业限制说明。
- 该包横跨基建、知识库、内容生产、咨询、产品、协作和内务运营；当前 Skills123 的单一 `scenario` 归属约束需要在访谈中确认。

## 官方目录映射

| 上游方向 | Skill | 中文用途概述 |
|---|---|---|
| 路由 | `ray` | 读取当前处境，选择下一步或编排已确认的工作管线。 |
| 基建 | `ray-vpsinit` | VPS 连通盘点、系统加固、代理栈、防火墙、验证与交接。 |
| 基建 | `ray-nodecheck` | 节点和中转链健康巡检，只诊断不修改。 |
| 知识库 | `ray-obsidian` | 安全新建或渐进适配 Obsidian 本地知识库。 |
| 内容 | `ray-writer` | 从 idea、资料、调研包或草稿装配中文长文。 |
| 内容 | `ray-cover` | 为定稿文章生成公众号、X 和 X Article 封面。 |
| 内容 | `ray-broll` | 把口播文稿或选题制作成编辑隐喻拼贴视频。 |
| 内容 | `ray-wechat` | 将定稿排版并在确认后创建或更新微信公众号草稿。 |
| 内容 | `ray-x-article` | 将长文和 5:2 封面保存为 X Articles 草稿。 |
| 内容 | `ray-thread` | 从真实经历提取 build-in-public thread 骨架，不代笔。 |
| 内容 | `ray-tweet` | 生成当日 X 主题推文候选，不自动发布。 |
| 内容 | `ray-metrics` | 拉取 X 账号数据，生成周报、归因和下周动作。 |
| 内容 | `ray-benchmark` | 拆解产品、账号或公司的可迁移机制。 |
| 内容 | `ray-report` | 生成 HTML、PDF 和公众号 Markdown 三种深度报告。 |
| 咨询 | `ray-diagnose` | 评估企业知识库或 AI 落地的就绪度和风险。 |
| 咨询 | `ray-proposal` | 将诊断结论转化为架构、选型、分期和运营方案。 |
| 产品 | `ray-idea` | 对产品概念进行消费社会批判和可行性压力测试。 |
| 产品 | `ray-launch` | 对落地页或 B2B 站执行上线、SEO、数据流和交接检查。 |
| 协作 | `ray-multimodel` | 在 Grok、Claude、Codex 之间做最小充分分工并由主控验收。 |
| 内务 | `ray-weekly` | 汇总项目、内容和业务线动态，收敛每周重点。 |
| 内务 | `ray-cleanup` | 生成项目归档和磁盘瘦身清单，删除前逐项确认。 |

## 安装与调用

安装全部 Skill：

```text
npx -y skills add imraywang/rayskills -g --all
```

官方建议从 `/ray` 开始，也可以直接调用成员，例如：

```text
/ray 我有个客户想上 AI 客服，不知道该先做什么
/ray-writer 把这条剪藏发展成一篇公众号长文
/ray-launch 帮我检查这个站是否可以上线
```

Skills123 详情页需要区分：

- 技能包安装命令：安装整个 `rayskills`。
- 成员调用命令：`/ray`、`/ray-writer` 等。
- 上游平台：Claude Code、Codex；README 还记录 WorkBuddy 的 ZIP 导入方式。

## 配套资源与依赖信号

- 每个 Skill 通常包含 `SKILL.md` 和 `evals/evals.json`。
- 部分成员包含 `references/`、`scripts/` 或 `agents/openai.yaml`。
- `tools/build.sh` 用于结构校验和 WorkBuddy 产物准备。
- `ray-vpsinit`、`ray-nodecheck` 涉及 SSH、VPS、网络节点和代理栈，属于高风险运维场景。
- `ray-wechat` 涉及微信公众号草稿写入，`ray-x-article` 涉及登录态浏览器和 X 草稿，默认均停在草稿，不自动发布。
- `ray-metrics`、`ray-tweet`、`ray-benchmark` 可能需要 X 数据或浏览器能力；不能把它们描述成零配置技能。
- `ray-broll`、`ray-cover`、`ray-report` 涉及图片、视频、PDF 或 HTML 产物，详情页应明确输出格式和外部工具要求。
- 研究快照没有建立逐项统一的 `plugin.json` 元数据，因此 Skills123 需要自己保存版本、来源、平台、依赖和许可证字段。

## 许可证与收录边界

- 仓库 LICENSE 是 CC BY-NC 4.0：允许分享和改编，但要求署名、链接原许可并禁止商业使用。
- 收录不等于把上游 Skill 文件复制进 Skills123；第一版应保存结构化目录元数据和来源链接，避免维护分叉副本。
- `rayskills` 的内部内容管线存在明确交接和确认门。网站详情应该展示“可执行流程”和“风险边界”，而不只是把它们列成普通命令。

## 待通过访谈确认

1. **已确认：收录范围**：按当前固定快照一次收录全部 21 项，包括 `/ray` 主路由和 20 个成员 Skill。
2. **已确认：任务场景**：归入 Skills123 的“内容”任务场景；跨领域成员通过包内技能方向区分，不拆出多个全站场景。
3. **已确认：包内分组**：沿用官方 8 条线——路由、基建、知识库、内容、咨询、产品、协作、内务。
4. **已确认：详情范围**：使用共享技能详情展示 21 项成员的中文说明、调用命令、整包安装、平台、输入输出、依赖、验证/恢复/确认边界、来源、固定 commit 和 CC BY-NC 4.0 许可证；不制作 21 个独立长文页。
5. **已确认：安装与调用入口**：技能包顶部复制整包安装命令 `npx -y skills add imraywang/rayskills -g --all`；成员详情复制 `/ray` 或 `/ray-*` 调用命令，不把成员调用命令标为独立安装命令。
6. **已确认：上游更新策略**：固定 commit `454bff330bb3ddae9d3c639bd0f791e6c61dd830` 快照，手动研究和同步，页面运行时不调用 GitHub API。
7. **已确认：名称与路由**：中文名称为“Rayskills 内容技能包”，英文标识为“RAYSKILLS BUILDER TOOLKIT”，数据 ID 为 `rayskills`，永久路由为 `/packages/rayskills/`。
