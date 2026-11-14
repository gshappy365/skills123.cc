---
title: "工作流、评分器与 benchmark"
description: "beta 能力：把一件多步的活写成 yaml，用评分器判断做得好不好，用 benchmark 比较工具和模型。"
---

# 工作流、评分器与 benchmark

## 先判断要不要读这页

这一层是 beta，而且比前七步重得多。满足下面三条里两条再看：

- 团队已经稳定用 `pull/push` 管资源；
- 有一件事反复做、步骤固定（发布、迁移、评审）；
- 想拿数字回答"换模型到底好没好"。

只想知道"怎么把技能发出去"，直接跳到 [诊断与维护](/guide/8-maintain/)。

## 工作流：把步骤写下来

`workflows/<名字>/WORKFLOW.yaml`，一次运行有明确的步骤和结局：

```yaml
schemaVersion: v1alpha1
name: release-check
description: 发布前把该跑的都跑一遍
steps:
  - id: lint
    command: npm run lint
  - id: test
    command: npm test
  - id: changelog
    command: node scripts/changelog.mjs
```

驱动方式两种：

```bash
teamai workflow start release-check --driver skill    # 当前编码会话驱动，你能看见每一步
teamai workflow start release-check --driver local    # 无头执行，适合 CI
teamai workflow start release-check --describe        # 只看它要什么输入
```

运行中用 `workflow next` 拿下一步、`workflow report` 上报结果、`workflow respond` 回答人工确认、
`workflow cancel` 取消。卡住了用 `workflow resume` 继续，跑完了可以用 `workflow publish` 把状态发到 `teamai-reports` 让 runner 接手。

## 评分器：判断"做得好不好"

`scorers/<名字>.md` 写标准，judge 按它给标签。它不只评工作流，也能评**已结束的 agent 会话**：

```bash
teamai score --session <id> --scorer code-quality
teamai score --run <run-id> --step lint --scorer code-quality
```

`teamai digest` 会把一段时间内的活动汇总成一份团队周报——这是"用了之后到底有没有变好"最省力的入口。

## benchmark：比较工具和模型

`benchmarks/<套件>/SUITE.yaml` 里放自己的任务，跑多个 arm 比较：

```bash
teamai benchmark run my-suite
teamai benchmark run my-suite --fail-on-regression   # 通过率掉了就退出码 1，能挂 CI
teamai benchmark try <task>                          # 单任务试跑，不用 init
```

## self-improvement：让失败变成改动

```bash
teamai self-improvement run code-quality
```

它把评分器反复判失败的场景，变成一个"改 harness + 加回归任务"的 PR，并在每个工具上验证。
这是三层里最"自动"的部分，也最需要人审。

## 代价与边界

<div class="tu-note tu-note--amber">
<strong>先把这三句读完</strong>
<p>工作流会真的执行命令，<code>--sandbox</code> 只是**声明这台机器是沙箱**，不是给你一个沙箱。</p>
<p>评分要用模型 judge，是要花钱的；团队可以设每日上限。</p>
<p>这一层是 beta，yaml 结构可能变。写之前先 <code>--describe</code> 看一眼当前版本的字段。</p>
</div>

## 你应该看到什么

`workflow start --describe` 能打印出工作流的输入 schema，而不是报"未知工作流"。

## 不对怎么办

- **说工作流不存在**：目录里缺 `WORKFLOW.yaml` 标记文件，teamai 就不认为那是个工作流。
- **跑起来立刻失败**：看 `teamai doctor` 的运行模式（attended / unattended），很多步骤在无人值守下行为不同。
- **评分一直跳过**：团队可能关了 `scoring`，或你这台机器的 `~/.teamai/config.yaml` 设了更严的限制。

## 下一步

[诊断、升级、换团队、卸载](/guide/8-maintain/)。
