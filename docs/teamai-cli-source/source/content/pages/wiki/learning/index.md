---
title: "经验（learning / recall）"
description: "团队踩过的坑写成可检索的条目；开了 recall，Agent 做任务前会先搜。"
---

# 经验（learning / recall）

## 一句话

`learnings/` 里的团队经验条目，用 `teamai recall` 检索。

## 打个比方

像团队的**踩坑笔记本**，只不过它会在你动手前主动翻给你看。

## 在这个项目里

```bash
teamai recall enable           # 默认关
teamai recall "port conflict"
teamai recall --check "改支付回调"   # 只做相关性预检
teamai recall maintenance --prune --dry-run
```

开了之后，会话里反复纠正或重试，结束时会提示把经验分享给团队。

## 常见误区

- **以为它会自动变多。** 需要人（或 `teamai contribute` / `import`）写进去。
- **以为开了就一定会搜。** 还有相关性预检，不相关就不打扰。
