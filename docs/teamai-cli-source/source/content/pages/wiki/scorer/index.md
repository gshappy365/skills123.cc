---
title: "评分器（scorer）"
description: "判断一次工作流或一次会话「做得好不好」的标准文件。"
---

# 评分器（scorer）

## 一句话

`scorers/<名字>.md` 里的评判标准，judge 按它给标签。

## 打个比方

像验收单：不是"看着还行"，而是逐条打勾。

## 在这个项目里

```bash
teamai score --session <id> --scorer code-quality
teamai score --run <run-id> --step lint --scorer code-quality
teamai digest        # 一段时间内的团队周报
```

它既是 Team Improvement 的入口，也是 `self-improvement` 的燃料：反复失败的场景会被变成一个改进 harness 的 PR。

## 常见误区

- **以为免费。** judge 要调模型，团队可以设每日上限。
- **以为评了就一定改进。** 标签只是信号，改不改还是人的决定。
