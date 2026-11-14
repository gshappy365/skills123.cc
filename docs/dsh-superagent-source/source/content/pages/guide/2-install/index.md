---
title: "安装与第一次启动"
description: "把插件装进一个独立的 DSH profile，配好状态目录，第一次把面板打开。"
---

# 安装与第一次启动

## 为什么要独立的 profile

默认建议建一个叫 `superagent` 的 profile，它是 DSH Web profile 的副本，和你平时用的那个分开。好处很实际：**它重启时不会关掉你自己的会话**。面板端口默认 `3082`，状态目录默认 `~/.dsh/state/superagent`。

## 一次性安装

下面是一台新机器上的顺序。如果你已经让编码智能体读 `SETUP.md`，这些它会替你跑，你只要看计划。

```
npm install -g @deepseek-ai/dsh@0.2.1-rc.3
git clone https://github.com/deepseek-ai/dsh-superagent-prototype dsh-superagent
cd dsh-superagent
pnpm install && pnpm build
dsh superagent --from-default-profile web --dump-config > /dev/null
dsh plugin --profile superagent add "link:$PWD"
```

<div class="tu-note tu-note--warn">
<strong><code>--from-default-profile</code> 只在全新安装时跑一次</strong><p>升级时重跑会替换 profile 并删掉 <code>cordis.patch.yml</code>，你的端口、状态目录、飞书开关全没。已有 profile 时请直接改那个文件。</p>
</div>

## 配置文件

把仓库里的 `examples/profile.cordis.patch.yml` 复制到 `$DSH_HOME/profiles/<profile>/cordis.patch.yml`，替换掉占位符。真实内容很短：

```yaml
- id: webserver
  config:
    host: 127.0.0.1
    port: 3082
- id: dsh-superagent
  config:
    stateDir: /home/me/.dsh/state/superagent   # 必须是绝对路径
# 飞书是可选的，启用时再打开：
# - id: dsh-superagent-feishu
#   disabled: false
```

`stateDir` 下面会放：`orchestrator.sqlite`（唯一的数据库）、`lock`、`worker-bin`（CLI 包装）、`worker-gitconfig`、`work`（工单默认目录）。升级前**先备份 `orchestrator.sqlite`**——迁移过的数据库旧版本打不开。

## 启停与体检

```
scripts/dsh-superagent start      # 在 tmux 会话里启动，最多等 1 分钟
scripts/dsh-superagent status     # 0 正常
scripts/dsh-superagent stop       # 优雅关闭，最多等 5 分钟
scripts/dsh-superagent restart
pnpm check                        # typecheck + test + build
```

`status` 的退出码：`0` 正常；`1` 没运行 / 双实例 / 无响应；`2` 某个组件报错，重启也修不好；`3` 还有安装步骤没做完。还能用 `--profile`、`--url` 或对应的环境变量指定目标。

## 打开面板

浏览器打开 `http://127.0.0.1:3082`，在 DSH Web 侧栏点 **Superagent**。管理 API 在 `/orchestrator/api/`，要求请求头 `x-orchestrator-request: 1`，且 host 必须是 `127.0.0.1:<port>` 或 `localhost:<port>`，否则返回 403。

<div class="tu-note tu-note--ok">
<strong>你应该看到什么</strong><p>Overview 上如果有缺项，会直接列出「还差什么」并链到对应设置；全部就绪时它很安静，不堆数字。这正是面板的设计：健康状态不占版面。</p>
</div>

## 不对怎么办

| 现象 | 去哪看 |
| --- | --- |
| 启动后立刻退出 | `.artifacts/` 下的启动日志（保留最近 20 个） |
| 面板 403 | 检查 host 与 `x-orchestrator-request` 请求头 |
| 保存设置后暂时失联 | 保存返回 `restarting: true` 会重启服务；等 `status` 不再退出 1 再继续 |
| 恢复会话报 `agent-preset/not-found` | `cordis.patch.yml` 里 `dsh-superagent-worker` / `-router` 两行不能删，也别手动给个人会话选这两个 preset |

## 下一步

[第 3 步：配好「谁能叫它干活」](/guide/3-policy/) ——这是整个系统里最该花时间的一页。
