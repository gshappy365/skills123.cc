---
status: accepted
---

# Host topic guides as static snapshots

Skills123 treats long-form collections such as the Shopify handbook as first-class 专题知识库 objects rather than 技能包. Each guide is generated into real static routes under `/guides/<id>/` from a committed content and media snapshot so GitHub Pages can serve it without another runtime or an upstream-site dependency.

The public UI identifies the collection as “整理与归档” but does not display upstream URLs; source URLs, crawl metadata, and snapshot provenance remain in repository data for maintenance and audit. Guide articles stay out of the global skill search, while the guide itself is discoverable globally and provides its own internal article search.

## Prototype verdict

A disposable nested-path prototype verified direct article routing, local assets, responsive layouts, technical-content tables, code blocks, and internal links on the same static-server shape used by GitHub Pages. It also exposed a filtering hazard: author CSS can override the browser's default `[hidden]` rule. The production guide search must therefore include an explicit `[hidden] { display: none !important; }` rule and a browser-level regression check.
