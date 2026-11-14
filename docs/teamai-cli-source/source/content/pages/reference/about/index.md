---
title: "关于与致谢"
description: "这份教程依据什么写的、和官方文档什么关系、哪些是原创。"
---

# 关于与致谢

## 这是什么

一份**非官方**的中文入门教程，讲 [Tencent/teamai-cli](https://github.com/Tencent/teamai-cli)
（TeamAI）：把团队的 skills、rules、agents、hooks、MCP、env、models 放进一个 Git 仓库，同步到每个人的 AI 工具。

## 内容依据

- 官方 `README.md` / `README.zh-CN.md`（产品概览、能力表、快速开始）
- `docs/usage-guide.zh-CN.md`（接入与使用指南目录）
- `docs/product-overview.zh-CN.md`（三层能力、仓库结构）
- `docs/guide/zh-CN/`：`getting-started`、`distribution`、`sharing`、`member-guide`、
  `skill`、`faq`、`reference`、`windows`、`providers`
- `skill-data/core/references/commands.md`（完整命令参考）

本文核对到 CLI `0.30.0`（2026-11）。命令、参数与行为==以官方仓库为准==；
版本更新后如有出入，请提 Issue 或直接以 `teamai --help` 的输出为准。

## 信息架构参考

站点的三栏骨架、双轨（新手 / 完整教程）、每页一句话、术语悬停、全站搜索、亮暗主题，
参考了 [nevertoday/xxd-pstack](https://github.com/nevertoday/xxd-pstack) 的公开做法。
那是另一份教程站，讲的是别的东西；本站只借用信息组织方式，没有复制它的教程正文、文案或插画。

界面用小小东 UI Kit（`public/xxd/`），构建产物遵循它自带的许可（非商用免费，商用需授权），
不在本站 MIT 范围内。

## 本站原创的部分

- 全部中文讲解、类比、表格与阅读顺序
- 每一篇里的「你应该看到什么 / 不对怎么办」
- [10 个常见的坑](/reference/pitfalls/) 与 [适不适合你](/reference/fit/) 的判断框架
- 首页的对比表、流程图与分流结构

## 反馈

发现哪里没写清楚、照做不成功：欢迎到官方仓库提 Issue（内容是官方的问题），
或在本站仓库提 Issue（讲法的问题）。

## 许可

本站原创文字与站点代码：MIT。上游 `Tencent/teamai-cli`：MIT，版权归腾讯及贡献者。
