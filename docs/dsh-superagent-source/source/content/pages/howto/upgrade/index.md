---
title: "升级不丢配置"
description: "按顺序备份数据库、拉代码、构建、重启，并避开两个会清掉配置的动作。"
---

# 升级不丢配置

## 正确顺序

```
# 1. 等执行器没有在途的 turn
# 2. 备份唯一的状态数据库
cp <stateDir>/orchestrator.sqlite <stateDir>/orchestrator.sqlite.bak
# 3. 拉代码、装依赖、构建
git pull && pnpm install && pnpm build
# 4. 重启
scripts/dsh-superagent restart
```

## 两个千万别做的动作

1. **别重跑 `dsh superagent --from-default-profile web --dump-config`。**它只在全新安装时跑一次；重跑会替换 profile 并删掉 `cordis.patch.yml`，端口、状态目录、飞书开关一起没了。已有 profile 请直接改文件。
2. **别删 `cordis.patch.yml` 里的 `dsh-superagent-worker` / `dsh-superagent-router` 两行。**会话还在使用时删掉，恢复会话会报 `agent-preset/not-found`。

## 为什么必须先备份

新版本迁移过的 SQLite，旧版本打不开。想回滚只能用升级前的备份，事后补不了。

## 提示词怎么办

你改过的内置部件会记录「基于哪版默认文字」。升级后如果默认值变了，面板把那项标成 **Default updated**，并排展示新旧默认值和你的文字，让你选「保留我的」或「用新的」。没改过的部件自动跟随新默认值。保存永远生成不可变版本，可以回退。

## 你应该看到什么

重启后 `status` 退出 0；Settings 里各组的保存历史还在；提示词页列出需要你决定的 `Default updated` 项。
