---
title: "发布前暴露审计"
description: "你打包出去的东西，把什么留给了别人：source map、调试符号、fuse 配置、凭证。"
---

# 发布前暴露审计

## 什么时候用

你要把一个桌面应用发出去之前。这是少数**不需要看别人代码、纯粹为自己好**的用法。

## 一条命令

```
rea audit-release-exposure ./dist/你的应用.app --json
```

带阈值（达到 high 就退出码 3，能直接卡住流水线）：

```
rea audit-release-exposure ./dist/你的应用.app --fail_on high --json
```

## 它会看什么

| 类别 | 例子 |
| --- | --- |
| 源码与映射 | 打包进去的 source map、未压缩源码 |
| 符号与调试 | 调试符号、断言、详细的错误堆栈 |
| Electron 配置 | fuse 是否还允许调试、`nodeIntegration` |
| 凭证 | 硬编码的 key、token、内网地址 |
| 元数据 | 内部版本号、构建路径、注释 |

## 结果怎么读

每条检查有严重级别。`--fail_on` 只影响退出码，不改变结果内容：

| 退出码 | 意思 |
| --- | --- |
| 0 | 跑完了 |
| 3 | 至少一条达到你设的阈值 |
| 1 | 没跑成 |

==未知或没评估的检查不会让退出码变 3==——它们是「没看」，不是「看了没问题」。

## 常见的四条修复

1. 生产构建关掉 source map（或者只上传到错误监控，不发包）。
2. 剥符号（`strip`），关掉断言。
3. Electron：把 `EnableNodeCliInspectArguments`、`RunAsNode` 这类 fuse 关掉。
4. 密钥全部移到运行时注入，不要编进 bundle。

## 放进 CI

```
- run: npx -y rea-agents@latest audit-release-exposure ./dist --fail_on high --json > exposure.json
- uses: actions/upload-artifact@v4
  if: always()
  with: { name: exposure, path: exposure.json }
```

## 下一步

顺带看看 [二进制加固](/howto/hardening/)。
