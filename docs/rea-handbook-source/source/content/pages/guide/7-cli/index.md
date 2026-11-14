---
title: "命令行与管道"
description: "不开 AI 也能用：常用命令、JSON 输出、证据 bundle、退出码，以及怎么让结果进 CI。"
---

# 命令行与管道

## 为什么还要学命令行

- **可复现。**模型每次调用可能不一样，命令每次都一样。
- **可脚本化。**CI 里跑 `audit-release-exposure --fail_on high`，比让 AI 判断可靠。
- **可验证。**模型说「查过了」，你可以自己跑一遍同一条命令对照。

## 输出格式

| 参数 | 作用 |
| --- | --- |
| `--json` | JSON（终端缩进、管道紧凑） |
| `--format json\|jsonl\|md\|csv\|tsv\|yaml\|toon` | 默认 TOON，人读友好 |
| `--detail summary\|complete` | 摘要或完整 |
| `--evidence_output FILE` | 把完整证据写到文件 |
| `--evidence-bundle FILE` | 同上，按 bundle 格式 |
| `--snapshot FILE` | 复用上次的分析结果 |
| `--timings` | 往 stderr 写耗时 JSON |

<div class="tu-note tu-note--tip">
<strong>管道里一定要 <code>--json</code></strong><p>默认的 TOON 是给人看的，<code>jq</code> 读不了。写脚本时顺手加 <code>set -o pipefail</code>，不然下游 <code>jq</code> 挂了你还以为成功。</p>
</div>

## 十分钟能用上的命令

```
# 1. 体检
rea doctor --json

# 2. 前端 / Electron 静态分析
rea analyze-javascript-application /绝对路径/应用 --json > app.json

# 3. 原生二进制总览（要引擎）
rea analyze /绝对路径/程序 --provider ghidra --json

# 4. 搜函数、看伪代码、查引用
rea search /绝对路径/程序 "search" --provider ghidra --json
rea function /绝对路径/程序 main --provider ghidra --json
rea decompile /绝对路径/程序 0x1000 --provider ghidra --json
rea xrefs /绝对路径/程序 0x1000 --provider ghidra --json

# 5. 拆容器
rea inspect-artifact app.asar --json
rea extract-artifact app.asar --json

# 6. 发布前审计
rea audit-release-exposure ./dist/你的应用.app --fail_on high --json
```

## 证据 bundle 的三个动作

```
rea evidence-import ./bundle.json          # 校验、报记录数与未知项修订数
rea evidence-export ./bundle.json ./canonical.json
rea compare ./left.json ./right.json --json
```

导出前不覆盖已有目标（除非 `--overwrite`）。导出是原子发布：中途取消会删掉暂存文件。

## 比较两个版本

```
rea inspect-artifact old.zip --json > old.json
rea inspect-artifact new.zip --json > new.json
rea compare-artifacts '{"left":{"kind":"evidence-file","path":"old.json"},"right":{"kind":"evidence-file","path":"new.json"}}' --json
```

`compare` 比的是证据身份和配对，不是重新读文件；`compare-artifacts` 比的是产物内容。两个别弄混。

## 退出码：只有四种

| 码 | 意思 |
| --- | --- |
| `0` | 完成了（可能带警告、部分证据、未解决项） |
| `1` | 没完成（参数错、权限、取消、超时） |
| `3` | `audit-release-exposure --fail_on` 达到阈值 |
| `128+N` | 被信号打断（130 = Ctrl-C，143 = SIGTERM，141 = 管道断了） |

在 CI 里，`0` 不代表「完全没问题」，它只代表「跑完了」。要看具体结论得读 JSON。

## 快照：省时间的关键

```
rea analyze /绝对路径/程序 --provider ghidra --snapshot ./an/program.json
rea analyze /绝对路径/程序 --provider ghidra --snapshot ./an/program.json   # 第二次直接复用
```

同样的路径 + 同样的查询，第二次就不重新分析了。调参数、反复试查询的时候这个最有用。

## 在 CI 里

```
- run: npx -y rea-agents@latest audit-release-exposure ./dist/MyApp.app --fail_on high --json
```

要点：

- Linux 上要装 procps；
- 时间预算按「导入 + 分析」给，别按「执行一个命令」给；
- 失败时把 JSON 存成构建产物，别只留一段终端文本。

## 不对怎么办

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `command not found` | 没全局安装 | `npm i -g rea-agents` |
| 输出读不了 | 忘了 `--json` | 补上 |
| 退出码 1 但没有错误信息 | stderr 被吞了 | 去掉 `2>/dev/null` 再看 |
| 退出码 141 | 管道下游提前关了 | 加 `set -o pipefail`，或先落到文件 |

## 下一步

[第 8 步：从看懂到做出来](/guide/8-rebuild/)。
