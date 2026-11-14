---
title: "检查二进制加固"
description: "ELF/PE/Mach-O 的加固项一次看全：栈保护、PIE、RELRO、签名、ASLR 相关位。"
---

# 检查二进制加固

## 什么时候用

你在发一个原生二进制，或者评估别人的二进制做得扎不扎实。

## 一条命令

```
rea inspect-binary-hardening /绝对路径/程序 --json
```

大文件可以设上限：`--max-file-bytes`。

## 你会看到什么

| 平台 | 常见项 |
| --- | --- |
| ELF | PIE、NX、栈保护、RELRO、Fortify |
| PE | ASLR（DYNAMICBASE）、DEP（NXCOMPAT）、CFG、签名 |
| Mach-O | PIE、栈保护、 hardened runtime、签名与公证状态 |

## 怎么用这份清单

- **给自己**：把它当成发布前的一张勾选表，缺哪项补哪项。
- **给别人**：这是「这个程序工程上做得好不好」的快速信号，不是安全性结论。

<div class="tu-note tu-note--warn">
<strong>别过度解读</strong><p>加固项齐全 ≠ 没有漏洞；缺一项 ≠ 能被利用。它只说明编译和打包时的选择。</p>
</div>

## 下一步

要连签名和证书一起看，`inspect-pe-certificates`、`inspect_signature`。
