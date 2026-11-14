# -*- coding: utf-8 -*-
"""How-to 十七篇 + 常见问题。

每篇只解决一件事，正文都给出可照抄的命令。事实依据官方 docs/guide/zh-CN/ 下的
getting-started、member-guide、sharing、distribution、faq、reference、tool-support 等页面。
"""

HOWTO = [
    # ---------- 一、上手五件事 ----------
    dict(
        slug="join-team", title="加入一个已有团队", nav="加入已有团队", minutes=4, order=1,
        group="一、上手五件事",
        desc="只要仓库地址，三条命令确认你真的和团队在同一个版本上。",
        body=r"""
## 什么时候用这篇

你入职、换项目、或者刚被拉进一个已经在用 TeamAI 的团队。

## 三步

```bash
# 1. 装 CLI（已经装了就跳过）
npm install -g teamai-cli

# 2. 在你要干活的目录里接入
cd /path/to/my-workspace
teamai init https://github.com/your-org/your-team-teamai

# 3. 检查
teamai doctor
teamai status          # 刚 init 完应该是空的
teamai list            # 能看到团队的 skills / rules / agents / hooks / mcp
```

想让整台机器都能用（不只是这个项目）：

```bash
teamai init https://github.com/your-org/your-team-teamai --scope user
```

## 你可能要先设两样东西

```bash
teamai roles list
teamai roles set frontend      # 团队统一分配时会被拒绝，那是正常的
teamai projects set checkout   # 只有团队用多项目分发时才需要
```

==不设角色，你会同步全部技能==。团队资源多的时候，先问管理员你要不要设。

## 你应该看到什么

`teamai list` 有内容，工具目录里出现对应的 `skills/<名字>/SKILL.md`，新开一次 AI 会话能说出团队规则。

## 注意

- 在 Git 仓库里，`init` 用的是仓库根目录，不是当前子目录。
- 团队成员只需要读权限；要分享资源才需要分支写权限。
""",
    ),
    dict(
        slug="share-skill", title="把自己的 skill 分享给团队", nav="分享一个 skill", minutes=4, order=2,
        group="一、上手五件事",
        desc="从本地工具目录推到团队仓库，中间会开一个 PR；合并后才对别人生效。",
        body=r"""
## 什么时候用这篇

你写了个顺手的技能，或者被要求"把这条规矩沉淀下来"。

## 命令

```bash
# 它在你的工具目录里，比如
#   ~/.claude/skills/release-check/SKILL.md
teamai push --skill ~/.claude/skills/release-check
```

不带参数会从本地找到的资源里让你挑：

```bash
teamai push
```

## 流程与边界

1. `push` 补全 `SKILL.md` 缺失的 frontmatter（`name`、`description`）。
2. 推一个 `teamai/push/…` 分支。
3. 在团队仓库开 PR。
4. **评审人合并**之后，同事下一次开会话才拉到。在那之前 `teamai list skills --source repo` 已经能看到它。

## 放哪个目录

| 目的 | 加什么 |
| --- | --- |
| 所有人可用（默认） | 不加参数 |
| 只给某个角色 | `--role frontend` |
| 只给某个项目 | `--project checkout` |

不确定就放共享根。加了命名空间，就要有人维护角色和项目，否则会出现"谁都收不到"。

## 规则、智能体、MCP 也一样

```bash
teamai push --file ~/.claude/rules/api-style.md --path rules/api-style.md
teamai push --role pm
```

## 你应该看到什么

命令结束会打印分支名和 PR 链接；平台上能看到 diff。合并后别人 `pull` 一次就有了。

## 注意

- **不要用 `rm` 删已分发的副本**，`pull` 会装回来；要删就 `teamai remove skills <名字>`。
- 提示 "no new resources detected" 说明本地没变化，不用推。
- 提示"将覆盖队友的改动"时它会停下来，先看清楚那份 diff 再用 `--carried`。
""",
    ),
    dict(
        slug="nothing-synced", title="团队资源拉不下来 / 工具里看不到", nav="拉不下来怎么办", minutes=5, order=3,
        group="一、上手五件事",
        desc="按「配置 → 钩子 → 工具目录 → 冲突」四层排查，每层一条命令。",
        body=r"""
## 先分清是哪一层出了问题

| 现象 | 大概是哪一层 |
| --- | --- |
| `teamai list` 就是空的 | 团队仓库没内容，或你没连上 |
| `list` 有，工具里没有 | 工具根目录不存在，或没选中那个工具 |
| 昨天有，今天没了 | 有人在仓库里删了它，或者你换了团队 |
| 提示 skipped / held | 同名冲突，或两个仓库给了不同内容 |

## 第 1 层：配置与仓库

```bash
teamai doctor
teamai status
teamai config show 2>/dev/null || true   # 不确定就打开 ~/.teamai/ 看
teamai pull --dry-run
```

`pull --dry-run` 只预览不落盘，能立刻看出它认为该做什么。

## 第 2 层：钩子

会话启动时的自动同步靠钩子。它没了，就只有手动 `pull`。

```bash
teamai hooks list
teamai hooks inject --dry-run
teamai hooks inject
```

Windows 上钩子需要额外配置，看 [让钩子在 Windows 上生效](/howto/windows-hooks/)。

## 第 3 层：工具目录

`pull` **不会**凭空创建缺失的工具根目录。如果你 `init` 时没选那个工具，它就不建。

```bash
teamai init --agent claude --force
teamai pull --force
```

工具 id 写小写，例如 `claude`、`codex`、`cursor`、`codebuddy`。

## 第 4 层：冲突与被跳过

`pull` 的输出里出现这些词，含义不一样：

- **Kept**：这个副本你改过，它不再投递，留不留你定。
- **Skipped**：同名技能只送一份，你的角色收到了另一份。
- **Held**：workspace 里两个仓库给了同名但内容不同的东西，它暂缓，等你统一。

## 你应该看到什么

`teamai pull` 的小结里出现 `Synced N skills`，且工具目录里有对应文件。

## 注意

- `teamai pull --force` 会忽略"仓库没变化"，全量对一遍，多数"看不到"的问题它能解决。
- 真的搞不清楚就先 `teamai pull --dry-run`，它不改文件，只说实话。
""",
    ),
    dict(
        slug="keep-out-of-git", title="让分发的文件不进入 git", nav="不进入 git", minutes=3, order=4,
        group="一、上手五件事",
        desc="一个开关，把 pull 下来的副本写进 .git/info/exclude，git status 就干净了。",
        body=r"""
## 为什么需要

项目级（workspace）安装会把技能、规则落到项目目录里。这些东西是团队分发的产物，不该进你的业务仓库。

## 开关

团队仓库的 `teamai.yaml`：

```yaml
sharing:
  gitExclude:
    enabled: true
```

或者本机项目配置里的 `gitExcludeEnabled: true`（本机优先）。

下一次 `pull` 生效。它写的是 `.git/info/exclude`，==不改 `.gitignore`==——因为这是"我这台机器的事"，不该提交给全团队。

## self 模式的例外

团队仓库就是业务仓库（`teamai init .`）时，有些工具的 hook 配置文件是提交进仓库的。
这时 teamai 只保留自己的内置钩子，团队自己的钩子写进旁边那个"个人文件"：

| 工具 | 提交的文件 | 团队 hook 去哪 |
| --- | --- | --- |
| Claude Code | `.claude/settings.json` | `.claude/settings.local.json` |
| CodeBuddy | `.codebuddy/settings.json` | `.codebuddy/settings.local.json` |
| Qoder | `.qoder/settings.json` | `.qoder/settings.local.json` |

## 你应该看到什么

`git status` 里看不到 `.claude/skills/…` 这类分发副本，但 AI 工具照常加载它们。

## 注意

- `gitExclude` 只管"别再冒出来"，已经 `git add` 过的文件不会被它移出暂存区，要自己 `git rm --cached`。
""",
    ),
    dict(
        slug="recipes", title="照抄就能用的场景清单", nav="场景清单", minutes=5, order=5,
        group="一、上手五件事",
        desc="八个最常见的场景，每个给一句可以直接发出去的话，或一条命令。",
        body=r"""
## 怎么用这页

把尖括号里的内容换掉，原样发出去。AI 工具里的用 `/teamai` 开头，终端里的用命令。

## 1. 从零搭建团队

```text
/teamai 帮我从零搭建团队的 TeamAI
```

它会问你仓库地址、要装到哪、给哪些工具装。

## 2. 加入已有团队

```text
/teamai 帮我加入团队的 TeamAI，仓库地址是 <repo-url>
```

## 3. 把本地 skill 分享出去

```text
/teamai 帮我把 <skill 名字> 分享给团队
```

## 4. 看看团队的资源

```bash
teamai list
teamai list skills --source repo
teamai list rules
```

## 5. 排查"我这边没有"

```bash
teamai doctor
teamai pull --dry-run
teamai pull --force
```

## 6. 团队网关统一模型

```text
/teamai 帮我把团队的模型网关切到 <配置名>
```

或者：

```bash
teamai models list
teamai models switch <配置名> --dry-run
teamai models switch <配置名>
```

## 7. 加一条所有人都躲不开的规则

```text
/teamai 帮我把 <规则名> 设成强制规则，成员不能删除
```

背后是 `teamai.yaml` 里的：

```yaml
sharing:
  rules:
    enforced: [<规则名>]
```

## 8. 打开本地看板

```text
/teamai 帮我打开 TeamAI 看板
```

或 `teamai dashboard`。

## 写法提醒

一句好指令通常包括三样：**要做什么 · 涉及哪个资源或哪个仓库 · 做完怎么算成功**。
最少也要有前两样，否则它会反问你，来回一轮反而更慢。
""",
    ),

    # ---------- 二、资源怎么写 ----------
    dict(
        slug="write-skill", title="写一个团队 skill", nav="写 skill", minutes=5, order=6,
        group="二、资源怎么写",
        desc="目录型和单文件型两种写法、frontmatter 的最小要求，以及它最后落在哪。",
        body=r"""
## 最小可用

```bash
mkdir -p ~/.claude/skills/my-deploy-helper
cat > ~/.claude/skills/my-deploy-helper/SKILL.md << 'EOF'
---
name: my-deploy-helper
description: 帮助团队部署服务
---
# Deploy Helper

当用户请求部署时：
1. 确认当前分支不是 main
2. 跑 npm test
3. 跑 npm run build
4. 执行 ./deploy.sh
EOF

teamai push --skill ~/.claude/skills/my-deploy-helper
```

`name` 和 `description` 是**必需品**：少了 `description`，工具里的技能列表就是一片空白描述，别人不知道该不该用。
没有 frontmatter 时 `push` 会自动补，但补出来的描述通常很糟，==自己写==。

## 两种形态

| 形态 | 仓库里的样子 | 适合 |
| --- | --- | --- |
| 目录型（推荐） | `skills/<名字>/SKILL.md` + 附件 | 需要模板、示例、脚本 |
| 单文件型 | `skills/<名字>.md`（frontmatter 里必须有 `description`） | 一两段话就说完 |

只有 frontmatter 带 `description` 的单文件才算技能；`README.md` 和随手笔记不会被分发。

## 附件怎么引用

目录型技能里，附件跟着目录一起走，直接用相对路径：

```markdown
模板见 templates/pr.md，按它写 PR 描述。
```

## 交付后长什么样

每个工具都会拿到 `<名字>/SKILL.md`，位置在它自己的 skills 目录里。
Codex 这类会放到 `.agents/skills`，因为它两个目录都读，放一处才能让技能之间互相引用。

## 命名

- 用小写字母和连字符：`release-check`，不要 `Release_Check`。
- 名字即身份。改名字等于新资源，旧的那份会被当作"不再投递"。

## 注意

- 同一位置同时存在 `skills/greet.md` 和 `skills/greet/` → 两边都不投递，直接报错。
- 别在技能里写死绝对路径，别人的机器上不存在。
- 技能里的命令要能重复执行，团队成员会跑很多次。
""",
    ),
    dict(
        slug="write-rule", title="写一条团队规则（含强制与目录型）", nav="写规则", minutes=5, order=7,
        group="二、资源怎么写",
        desc="单文件、目录型、强制三条路，以及 paths 限定和 ${TEAMAI_RULE_DIR} 的用法。",
        body=r"""
## 单文件版：一条规矩一个文件

```bash
cat > ~/.claude/rules/api-style.md << 'EOF'
# API 风格

- 所有接口返回 { data, error } 结构
- 不要在 handler 里直接拼 SQL
- 新增接口必须补一条集成测试
EOF

teamai push
```

## 只对某些路径生效

```markdown
---
paths: ["src/api/**"]
---
（规则正文）
```

支持限定路径的工具会只在这些文件上生效；不支持的（比如 Codex 系列）会一直生效。

## 目录型版：规则带附件

```text
rules/api-style/
├─ RULE.md
├─ RULE.zh.md
├─ checklist.md
└─ examples/good-endpoint.ts
```

```markdown
<!-- rules/api-style/RULE.md -->
---
paths: ["src/api/**"]
---
按团队 API 风格写。新增接口前先读 ${TEAMAI_RULE_DIR}/checklist.md 和 ${TEAMAI_RULE_DIR}/examples/good-endpoint.ts。
```

`${TEAMAI_RULE_DIR}` 在 `pull` 时替换成交付目录的真实路径（正斜杠），所以附件能跟着走。

==标记文件名必须完全一致==：`RULE.md` 不是 `rule.md`。大小写在 macOS 上不敏感，但 teamai 是严格匹配的。

## 强制规则：成员删不掉

```yaml
# teamai.yaml
sharing:
  rules:
    enforced: [code-review-guide]
```

适合安全底线、提交规范这类"不接受商量"的。别把还在讨论的东西设成强制——那会让讨论变成对抗。

## 多语言版本

同一目录放 `RULE.zh.md` / `RULE.en.md`，按团队配置的 `language` 取同语言版本。
`RULE.md` 的 frontmatter 对所有语言生效。

## 你应该看到什么

`teamai list rules` 里能列出它；`pull` 后各工具 rules 目录里出现同名 `.md`。

## 注意

- 目录型规则交付到 `.teamai/delivered/rules/<名字>/`，不要在业务代码里 import 那个路径。
- `push` 不会从交付副本里提取改动，改规则要改仓库里的源文件。
""",
    ),
    dict(
        slug="team-mcp", title="给团队挂一个 MCP server", nav="挂 MCP server", minutes=5, order=8,
        desc="单文件与目录型两种写法，token 怎么走，以及为什么脚本要用 ${TEAMAI_MCP_DIR}。",
        group="二、资源怎么写",
        body=r"""
## 最简单的：一个远程服务

```yaml
# mcp/mcp.yaml
servers:
  - name: gpu-analysis
    description: GPU 存量与价格查询
    transport: http
    url: https://example.com/api/mcp
    headers:
      Authorization: Bearer ${GPU_ANALYSIS_TOKEN}
    timeout: 600000
```

`${GPU_ANALYSIS_TOKEN}` 在 `env/secrets.yaml` 里声明，值由每个人自己设：

```yaml
# env/secrets.yaml
secrets:
  - key: GPU_ANALYSIS_TOKEN
    description: GPU 查询服务的 token
    url: https://example.com/tokens
```

```bash
teamai env set GPU_ANALYSIS_TOKEN      # 交互输入，值只留在本机
```

## 带脚本的：目录型

```text
mcp/jira-lite/
├─ MCP.yaml
├─ server.py
└─ queries.sql
```

```yaml
# mcp/jira-lite/MCP.yaml
description: 只读的 Jira 查询
transport: stdio
command: uv
args: ["run", "--script", "${TEAMAI_MCP_DIR}/server.py"]
requires: [uv]
```

- 目录型只支持 `stdio`。
- `${TEAMAI_MCP_DIR}` 替换成目录路径，脚本和 `queries.sql` 一起走。
- `requires` 声明 PATH 上需要的运行器，`teamai mcp inject` 会提示缺什么。

依赖的三种稳妥写法：PEP 723 脚本（`uv run --script`）、打包好的 `.mjs`（`node`）、固定版本 runner（`npx -y pkg@1.4.0`）。

## 注入与卸载

```bash
teamai mcp list
teamai mcp inject --dry-run
teamai mcp inject
teamai mcp remove
```

`teamai pull` 时也会同步。要覆盖和用户自有条目冲突的 server，加 `--force`。

## 某个人不想装

```bash
teamai skill exclude add jira-lite
teamai pull
```

排除列表**按名字**生效，不分类型：排掉叫 `jira-lite` 的 MCP，也会排掉同名的 skill。

## 注意

- 密钥只写 `${VAR}`，值永远不进仓库。团队仓库是公开的，别赌。
- Claude Code 不展开 `.mcp.json` 里的 `$CLAUDE_PROJECT_DIR`，所以各工具的 MCP 文件写的是 worktree 绝对路径，每个 worktree 不同。
- 每个人机器上的 path 不同，脚本里不要用绝对路径。
""",
    ),
    dict(
        slug="team-model", title="用团队网关统一模型", nav="统一模型网关", minutes=4, order=9,
        group="二、资源怎么写",
        desc="团队发一份网关配置，成员 switch 一下，密钥仍留在各自机器上。",
        body=r"""
## 团队这边：写一份 profile

```yaml
# models/models.yaml
profiles:
  - id: tokenhub
    name: Tencent TokenHub
    base_url: https://tokenhub.tencentmaas.com
    api_key: ${API_KEY}
    model_groups:
      - protocols: [anthropic, openai-chat-completions]
        models:
          - glm-5.3
          - deepseek-v4-flash
```

两条硬规则：

- `api_key` **必须**写成 `${API_KEY}` 这种形式，值不能进仓库。
- `base_url` 不要以 `/v1` 结尾。

第一个模型是默认。

## 成员这边：两步

```bash
teamai models list
teamai models switch tokenhub --dry-run
teamai models switch tokenhub
```

密钥放环境变量，不要写进命令参数：

```bash
teamai models configure tokenhub --from-env TOKENHUB_API_KEY
printf '%s' "$TOKENHUB_API_KEY" | teamai models configure tokenhub --api-key-stdin
```

只想切某一个工具：

```bash
teamai models switch tokenhub --agent claude
teamai models switch --agent claude --model deepseek-v4-flash
```

## 它能改哪些工具

`switch` 写入的是各工具自己的配置：Claude Code 写 `~/.claude/settings.json`，Codex 写 `~/.codex/config.toml`，
CodeBuddy / WorkBuddy 写 `models.json`，其它工具各有落点。协议不匹配的会被跳过——比如配置里没有
`openai-responses`，就不会改 Codex。

## 想还原

```bash
teamai models restore
teamai models restore --agent codex
```

它只还原 teamai 改过的字段。==你自己手动改过的，之后的 switch 和 restore 会跳过==，不会跟你抢。

## 注意

- 换了网关地址要重新 `switch`，否则 agent 还指着旧地址。
- 个人配置用 `teamai models add`，id 不能和团队的撞名，撞了就写 `local:<id>`。
""",
    ),

    # ---------- 三、谁收到什么 ----------
    dict(
        slug="set-role", title="按分工限定谁能收到什么", nav="设角色", minutes=5, order=10,
        group="三、谁收到什么",
        desc="roles.yaml 怎么写、成员怎么设、以及为什么只写 roles.yaml 限定不了任何人。",
        body=r"""
## 先理解一件事

命名空间**只对设了角色的人生效**。没设角色的人会同步全部资源。所以：

```text
只写 roles.yaml  →  限定不了任何人
roles.yaml + 大家都设了角色  →  才开始限定
roles.yaml + manifest/members.yaml  →  真正收窄
```

## 管理员：定义角色

```yaml
# manifest/roles.yaml
version: 1
roles:
  - id: frontend
    description: Web 工程师
    resources:
      knowledge: [common, frontend]
      skills: [common, frontend]
      agents: [common, frontend]
  - id: backend
    description: 服务端
    resources:
      knowledge: [common, backend]
      skills: [common, backend]
```

资源按目录放：`skills/frontend/xxx/SKILL.md`、`rules/frontend/xxx.md`。

## 成员：设一次

```bash
teamai roles list
teamai roles set frontend
teamai pull
```

## 团队强制分配（可选但推荐）

```yaml
# manifest/members.yaml
version: 1
members:
  alice: [frontend]
  bob: [backend, ki]
default: []
```

这个文件存在后：

- 角色由文件决定，`teamai roles set` 被拒绝；
- 没列出的成员只收共享资源；
- 改角色要提 PR 评审——==角色变更从此有记录==。

## 收回资源会发生什么

`pull` 会收回新命名空间之外、由 teamai 下发的副本。**你本地改过的会保留**，并提示出来。

## 应该看到什么

```bash
teamai roles list --json
```

`source` 字段告诉你角色从哪来：`assigned`（members.yaml）、`default`、`local`（自己设的）、`none`。

`source: local` 但团队有 `members.yaml`，说明你还没被列进去。

## 注意

- 角色是**减法**，项目也是减法，标签是加法。三样别混着用。
- 角色不是安全边界：agent 以你的身份运行，你能改配置文件。它给你的是"经过评审的约定"，不是强制执法。
""",
    ),
    dict(
        slug="set-project", title="一个目录一套资源", nav="设项目", minutes=4, order=11,
        group="三、谁收到什么",
        desc="多服务团队怎么让 checkout 目录只拿到收银台相关的技能、env 和 MCP。",
        body=r"""
## 什么时候用

一个仓库里做好几个服务，或者你同时维护几个仓库，各自的技能、环境变量、MCP 都不一样。

## 管理员：定义项目

```yaml
# manifest/projects.yaml
version: 1
projects:
  - id: checkout
    name: 收银台
    resources:
      knowledge: [checkout]   # rules/checkout/、claudemd/checkout/
      skills: [checkout]
      learnings: [checkout]
      agents: [checkout]
      env: [checkout]         # env/checkout/env.yaml
      hooks: [checkout]
      mcp: [checkout]
      models: [checkout]
      docs: [checkout]
```

## 成员：在当前目录激活

```bash
teamai projects list
teamai projects set checkout
teamai pull
```

取消：

```bash
teamai projects set
```

## 和角色的关系

两者正交：你既是 `frontend`，又在做 `checkout`，两边的资源都收。
角色决定"你这类人需要什么"，项目决定"这个服务需要什么"。

## 应该看到什么

`teamai projects list` 里 `checkout` 标记为当前激活；`pull` 后 `env/checkout` 的变量只在这个目录下的 shell 里生效。

## 注意

- 项目资源激活后会写进本目录的配置，换目录就是另一套。
- workspace 里的多个仓库各自激活各自的项目，`pull` 在 workspace 根目录也能看到它们的名字。
""",
    ),
    dict(
        slug="use-tags", title="用标签做自愿订阅", nav="用标签订阅", minutes=4, order=12,
        group="三、谁收到什么",
        desc="不想为少数人的资源建角色时，用标签：不订阅就没有，订阅了才额外拉。",
        body=r"""
## 标签和角色的区别

| | 角色 | 标签 |
| --- | --- | --- |
| 方向 | 减法（只收声明的） | 加法（额外收订阅的） |
| 谁定 | 团队定义，成员选 | 团队打标，成员订阅 |
| 用途 | 分工边界 | 兴趣 / 专项 |

## 管理员：打标签

```yaml
# tags.yaml
skills:
  hai-deploy: [hai, infra]
rules:
  code-style: [coding]
```

```bash
teamai tags add skills hai-deploy hai infra
teamai tags add rules code-style coding
```

## 成员：订阅

```bash
teamai tags list
teamai tags subscribe infra
teamai pull
```

取消：

```bash
teamai tags unsubscribe infra
teamai pull
```

## 语义边界

- 没订阅任何标签时，标签**完全不参与**分发。
- 订阅之后，带这些标签的 skill 和 rule 也会拉下来。
- **没打标签的仍按角色和项目发**——标签永远不会排除东西。

## 注意

- 标签从来不用于限制。想限定，用命名空间 + 角色。
- 标签存在团队仓库的 `tags.yaml` 里，改它要走 PR。
""",
    ),

    # ---------- 四、出问题怎么办 ----------
    dict(
        slug="doctor", title="doctor 说了什么，怎么修", nav="doctor 怎么读", minutes=5, order=13,
        group="四、出问题怎么办",
        desc="诊断输出的常见条目、对应原因，以及哪些能 --fix、哪些必须人处理。",
        body=r"""
## 先跑它

```bash
teamai doctor
teamai doctor --json | head -40      # 机器可读
```

它会打印运行模式（attended / unattended）及其来源，然后是各分区检查。

## 常见条目对照

| 提示大意 | 原因 | 怎么修 |
| --- | --- | --- |
| 未初始化 / no repo | 还没 `init` | `teamai init <repo>` |
| hook 缺失 | 钩子没注入，或被工具升级冲掉 | `teamai hooks inject` |
| 工具未识别 | 工具装在不常见的位置 | 用 `--agent` 显式指定，或设工具自己的目录变量 |
| token 未设置 | 声明了 secret 但没给值 | `teamai env set <KEY>` |
| 遗留锁文件 | 上次进程被 kill | `teamai doctor --fix` |
| 其他安装 | 机器上有多份全局 teamai | 配置 `updateOtherInstallations` |
| workspace 子项被排除（left out） | 那个仓库用的是别的团队仓库 | 在它里面 `init` 同一个团队，或保持独立 |

## `--fix` 会做什么，不会做什么

会：清理死进程遗留的锁、删除失败的运行分支、按保留策略清理过期残留。

不会：删掉仍被活进程持有的锁、删掉没记录所有者的锁、改你的业务文件。

## 锁的两种错误别混

- **`Cannot acquire lock`**：文件系统问题（权限、磁盘满、父路径是文件）。等别的进程没用，先修文件系统。
- **崩溃后留下的锁**：锁里记了 PID。所有者已死的锁，下一个命令会自动回收，`doctor --fix` 也能清。

## 你应该看到什么

每一行前面是 ✓ 或明确的 ⚠ + 一句修法。它不会只说"出错了"。

## 注意

`doctor` 报告的是它所在 workspace 的情况。换目录再跑一次，可能是另一套配置。
""",
    ),
    dict(
        slug="name-conflict", title="同名资源被跳过（Skipped / Held）", nav="同名冲突", minutes=4, order=14,
        group="四、出问题怎么办",
        desc="两种冲突：同一仓库里同名技能，和 workspace 里两个仓库给了不同内容。",
        body=r"""
## 先看是哪种

## 情况一：同一团队仓库里，多个命名空间有同名技能

```text
skills/release/SKILL.md            共享根
skills/dev/release/SKILL.md        角色 dev 的
skills/sre/oncall/SKILL.md         角色 sre 的
```

一个技能名只落一个目录，所以只能给你一份。规则：

- 有角色 → 拿你角色收到的命名空间里的那份；
- 共享根那份只能通过标签到达；
- 两个命名空间都有 → 按名字排序靠前的胜出；
- `pull` 会逐条说被跳过的是哪一份、要哪个角色才能拿到。

**解法**：真要让所有人同时拿到两份，就改名，比如 `skills/dev/release-staging/`。

## 情况二：workspace 里两个仓库给了同名但内容不同的东西

```text
⚠ [workspace] Held skills/lint: differs between svc-a and svc-b
```

teamai 暂缓它，之前装的那份保持不变。**每个仓库自己仍然收它那一份。**

**解法**：在团队仓库里把两份内容改成一致，或者给其中一个改名。

## 情况三：单文件与目录同名

```text
skills/greet.md
skills/greet/SKILL.md
```

两边都不投递，直接报错。删掉其中一个。

## 情况四：你自己的技能和团队的撞名

团队副本会放到另一个目录（比如 `.codex/skills`），并在每次完整 pull 时打印冲突提示。
你自己那份不会被改动。

## 应该看到什么

`teamai pull` 的输出里，每个被跳过的条目都跟着"要哪个角色才能拿到"的提示。

## 注意

如果某台机器的检出已经是团队最新提交，它会保留现有副本，直到团队有新提交。想立刻切换：`teamai pull --force`。
""",
    ),
    dict(
        slug="switch-team", title="换一个团队 / 换一个仓库", nav="换团队", minutes=4, order=15,
        group="四、出问题怎么办",
        desc="force 重新 init，pull 一次换血；哪些副本会被删、哪些会留下。",
        body=r"""
## 命令

```bash
teamai init https://github.com/your-org/platform-team --agent claude,codex --force
teamai pull
```

## 这次 pull 会做什么

| 之前（frontend 团队） | 之后（platform 团队） |
| --- | --- |
| `.claude/skills/react-review` | 删除（旧团队发的，你没改过） |
| `.claude/skills/storybook`（你改过） | 保留，并提示 |
| `.codex/skills/storybook` | 删除 |
| `.claude/rules/frontend-style.md` | 删除 |
| — | 新增 `.claude/skills/terraform-plan` 等 |

一句话：==旧团队下发、你没动过的会清掉；你动过的会留着并点名==。

## 两个例外

- **Hermes / OpenClaw**：全机共用一个技能目录（`~/.hermes/skills`），旧团队的技能会留下，要手动确认后删。
- **self 模式**：资源写在仓库的 `.teamai/` 里，换团队等于换那个仓库的内容。

## 想先试新团队，不动老配置

```bash
teamai pull --team-ref feature/review-skill
teamai pull --team-ref main        # 解除固定
```

`--team-ref` 适合"团队发了个新分支，我想先试试"，要求 workspace 安装，且该团队没装在 user scope。

## 你应该看到什么

`pull` 输出里同时出现 `Removed N skill(s) no longer delivered here` 和 `Kept …` 两种行。前者是清理，后者是保护你的改动。

## 注意

- 别删 `~/.teamai/` 来"重置"——那会丢掉角色、项目选择和密钥引用。
- 换团队前先 `teamai status --all` 看一眼有哪些分区。
""",
    ),
    dict(
        slug="upgrade-uninstall", title="升级与卸载不留垃圾", nav="升级与卸载", minutes=4, order=16,
        group="四、出问题怎么办",
        desc="update 不用重装，uninstall 能预览；两条命令加上正确的顺序，收尾干净。",
        body=r"""
## 升级

```bash
teamai update --check
teamai update
```

不用重跑 `init`。配置、资源、角色选择都在原地。

多份全局安装（nvm 下多个 Node）想让它们一起更新：

```yaml
# ~/.teamai/config.yaml
updateOtherInstallations: true
```

## 卸载：先预览

```bash
teamai uninstall --dry-run
```

它会逐条列出"将移除的受管路径"，==不改任何东西==。看完确认清单里没有你手写的文件，再执行：

```bash
teamai uninstall              # 交互确认
teamai uninstall --force      # 脚本 / CI
teamai uninstall --agent claude   # 只卸一个工具
```

## 删除规则

- 你自己建的文件**留下**。
- teamai 写进去的部分去掉后，如果整份文件空了，才删整份。
- 整机级卸载会保留仍登记的项目数据。想彻底干净：**先逐个卸载项目，再在任何项目之外跑一次**。

## 钩子留在别处的情况

卸载预览里出现 "Kept for other teamai installs"，说明还有别的安装在用这些钩子。
确认没有别的 workspace 还在用之后：

```bash
# 在仍配置了 TeamAI 的工作区里
teamai hooks remove
# 然后在工作区之外
teamai uninstall
```

## 最后清 npm 包

```bash
npm uninstall -g teamai-cli
```

`uninstall` 只删注册和资源，不删 npm 包。

## 想回来

```bash
teamai init --repo https://github.com/your-org/your-team --scope user --force
```

## 注意

备份只需要两样：**团队仓库**（Git 本身就是备份）和 **`~/.teamai/`**。
各工具目录里的副本是投影，`pull` 就有，不用备份。
""",
    ),
    dict(
        slug="windows-hooks", title="让钩子在 Windows 上生效", nav="Windows 钩子", minutes=4, order=17,
        group="四、出问题怎么办",
        desc="Windows 上钩子要跑命令，缺口通常在 shell 与路径；先确认哪一环断了。",
        body=r"""
## 症状

在 Windows 上 `init` 成功、`list` 有内容，但开会话时不会自动同步；或者钩子报"命令不存在"。

## 排查顺序

```bash
teamai doctor
teamai hooks list
teamai hooks inject --dry-run
```

## 三个常见原因

1. **没有可用的 shell 环境。** 钩子命令要被执行器调用。Git Bash 或 WSL 存在时最稳。
2. **路径里有空格或中文。** 安装目录带空格时，钩子里的命令容易被截断。换一个纯英文路径更省事。
3. **工具配置里写的是反斜杠路径。** 部分工具配置文件里要正斜杠；teamai 写入时会转，但你自己改过就会被覆盖回去。

## 值得先做的两件事

```bash
# 用 Git Bash 跑一次，确认命令本身没问题
teamai pull

# 重新注入钩子，让它按当前 shell 重写配置
teamai hooks inject
```

## 官方文档

Windows 的钩子与 shell 配置有单独一页说明：`docs/guide/zh-CN/windows.md`。
本站不复制它的正文，遇到具体报错去那里对一遍。

## 实在不行

会话启动同步不是必须的。手动跑 `teamai pull` 效果完全相同，只是要你自己记得。

```bash
teamai pull --dry-run
teamai pull
```

## 注意

- Windows 上的默认目录和 Linux/macOS 不同（例如 Hermes 在 `%LOCALAPPDATA%\hermes`）。
- `teamai doctor` 会说明它认到的是哪个主目录，对不上就是这里是问题。
""",
    ),
]

FAQ_HOME = r"""
## 要花钱吗

TeamAI 本身是 MIT 许可的开源项目，用 Git 仓库做中心，没有服务端订阅。你要花的钱只在两处：
跑工作流 / 评分时消耗的模型额度，以及你自己的 Git 托管费用（公开仓库通常免费）。
只用第一层（skills、rules、hooks、mcp）几乎不产生额外调用。

## 一定要用 GitHub 吗

不用。官方支持 GitHub、GitLab、GitCode、CNB、工蜂（TGit）和私有 Git 服务。
私有 Git 用 `--provider git`，直接复用你现有的 SSH Key 或 Git 凭据，只是 PR 要你自己去网页上开。
完全没有 Git 也能只读接入：`init --http <地址> --token <key>`。

## 它会不会改我的文件

会往**你的 AI 工具目录**写文件：skills、rules、agents、hooks、mcp 配置、env 注入。
它不会改你的业务代码。

三层保护：

- `pull` **不覆盖你改过的副本**，会保留并提示；
- 想彻底看不见，打开 `gitExclude`，它把这些路径写进 `.git/info/exclude`；
- 卸载时你自己建的文件会留下，只有"teamai 写进去的那部分"会被去掉。

## 密钥安全吗

仓库里只声明 key，值永远不进仓库：

```yaml
# env/secrets.yaml
secrets:
  - key: GITHUB_TOKEN
    description: GitHub token（repo scope）
    url: https://github.com/settings/tokens
```

成员各自 `teamai env set GITHUB_TOKEN`。模型配置同理，`api_key` 必须写 `${API_KEY}`。

==但要注意==：被分发的 hooks 会真的在你机器上执行命令。团队仓库的合并权限就是这个系统的安全边界，
别把不评审的仓库接进来。

## 多人同时改会不会打架

不会静默打架。三种情况分别处理：

- 你在本地改过的副本，`pull` 保留并提示；
- 同名资源冲突，`pull` 停下来告诉你"要哪个角色才能拿到"；
- `push` 要覆盖队友改动时，它会停并打印一个值，要你看过 diff 再用 `--carried` 确认。

## 为什么同事收到了我没收到

按这个顺序查：

1. `teamai roles list --json` 看 `source`：`none` 说明你没设角色（没设角色反而会收全部，见下一条）；
2. `teamai list` 看资源在不在团队仓库；
3. `teamai pull` 的输出了有没有 `Skipped` / `Held`；
4. `teamai doctor` 看钩子和工具目录。

## 为什么我没设角色，反而收到全部

这是官方设计里的一个坑：命名空间只对**设了角色**的成员生效，没设角色就同步全部。
要真正收窄，得靠 `manifest/members.yaml` 把成员列进去。详见 [设角色](/howto/set-role/)。

## 能不能离线用

能。资源拉下来之后就在本地了，断网也能用。
`pull` 失败不影响已有副本，下一次开会话会重试。

## 支持哪些 AI 工具

覆盖面很宽：Claude Code、Codex、Cursor、CodeBuddy、WorkBuddy、GitHub Copilot CLI、OpenCode、
Pi Coding Agent、Oh My Pi、OpenClaw、Hermes、DeepSeek Harness、Qoder、Kiro、Trae、ZCode、JoyCode、
Muse Code、Antigravity 等。各工具支持的能力不一样（比如 Cursor 不支持 models），
官方 README 的能力表是唯一准确来源。

## 和"每人自己配"比，代价是什么

多一层同步、多一层评审、多一个要维护的仓库。换来的是统一、可追溯、可回滚。
团队小于三个人时，这笔账通常不划算——见 [适不适合你](/reference/fit/)。
"""
