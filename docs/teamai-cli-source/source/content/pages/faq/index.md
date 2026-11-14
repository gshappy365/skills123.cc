---
title: "常见问题"
description: "要钱吗、一定要 GitHub 吗、会不会改我的文件、密钥安全吗、多人会不会打架、能离线用吗。"
---

# 常见问题

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
