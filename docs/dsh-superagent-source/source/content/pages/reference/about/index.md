---
title: "关于本站与致谢"
description: "本站的来源、写法、许可边界，以及内容出错时怎么反馈。"
---

# 关于本站与致谢

## 这是什么

一份**非官方的中文新手教程**，讲的是 `deepseek-ai/dsh-superagent-prototype`。目标是把一份英文、面向资深工程师的研究原型文档，拆成不会写代码也能顺着走的路径：三课入门、九步完整教程、按问题查的 How-to、术语表和常见问题。

本站不包含、也不替代官方仓库。所有命令、版本、行为请以[官方仓库](https://github.com/deepseek-ai/dsh-superagent-prototype)为准。

## 内容依据

- 官方 `README.md`、`SETUP.md`、`package.json`、`examples/profile.cordis.patch.yml`；
- 编号文档 `docs/000-philosophy.md` 到 `docs/008-cookbook.md`；
- 框架与教学设计参考 [nevertoday/xxd-pstack](https://github.com/nevertoday/xxd-pstack) 的公开信息架构：**数据驱动导航、新手入门与完整教程双轨、每页一句话说明、可照抄的提示词、「你应该看到什么 / 不对怎么办」、术语悬停、亮暗主题与全站搜索**。

本站的文字、示例请求、类比、表格与页面组织均为原创撰写，没有复制上述两个仓库的教程正文、文案或插画。示例中出现的命令与配置项来自官方文档；示意性的请求正文是本站按官方文档描述的语法构造的，不是官方给出的模板。

## 界面

三栏骨架（顶栏 / 左侧导航 / 正文 / 右侧目录）、设计令牌与交互组件来自用户本地已有的 `xxd-ui-kit` 构建产物，遵循其自带的许可（PolyForm Noncommercial 1.0.0，非商用免费、商用需授权）。本站只沿用其布局方法，没有改动或重新分发该套件之外的美术资产。

## 教程内容许可

本站原创文字与站点代码采用 MIT 许可。`public/xxd/` 下的 UI Kit 构建产物不在其内，适用它自己的许可。

## 发现哪里不对

- 内容依据的是公开文档，上游更新后请对照 [命令速查](/reference/commands/) 复核；
- 照着做不成功，先看 [踩坑清单](/reference/pitfalls/) 与 [@ 了没反应](/howto/no-response/)；
- 仍有问题，欢迎到项目仓库提 Issue，写清楚你走到哪一步、屏幕上出现了什么。

## 一句话致谢

感谢 DeepSeek Harness Team 把这套设计连同它的取舍一起公开出来，也感谢 xxd-pstack 把「怎么把一个复杂工具讲给新手」这件事做成了一套可复用的方法。
