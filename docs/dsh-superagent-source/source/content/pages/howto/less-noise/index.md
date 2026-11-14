---
title: "消息太多怎么调"
description: "按「改短 → 改严 → 暂停」的顺序处理，不要再加消息解释噪音。"
---

# 消息太多怎么调

## 顺序别反

仓库 `000-philosophy.md` 里的操作者责任写得很直接：**吵的时候把提示词改短改严，或者暂停它，不要加更多消息去解释噪音。**

1. **改短**：Settings → Prompts → Communication，把「什么时候说话」写得更窄。默认聊天消息一句话、硬上限 100 词。
2. **改严**：Ticket scope 里把「什么时候带着草稿停下」写清楚；Delivery requirements 里把「什么才算可以给结果」写清楚。
3. **暂停**：Execution 页的 `Pause processing` 停掉自动处理。它是暂停，不是删除，人不受影响。
4. **收窄名单**：Settings → Eval → On each Source，把允许名单缩回到少数几个人。

## 先分清是哪种吵

| 现象 | 大概是 | 去哪改 |
| --- | --- | --- |
| 一条接一条的进度汇报 | Communication 太宽 | 提示词 |
| 没做完就说有结果 | 交付标准太松 | Delivery requirements |
| 没人叫它也在提议干活 | 接单模式放太开 | accept mode 回到 `observe` |
| 群里谁都能触发 | 名单或准入表太宽 | On each Source |

<div class="tu-note tu-note--warn">
<strong>别用「再发一条说明」来解决「发太多条」</strong><p>这是最容易犯的错。每一条消息都花掉同事的注意力，包括你解释它为什么发消息的那一条。</p>
</div>

## 相关

[暂停、停止与解除](/howto/pause-stop/) · [调提示词](/guide/8-tune/)
