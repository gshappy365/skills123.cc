---
status: accepted
---

# Show the in-package skill relationship graph

技能包工作台需要一层包内技能关系的可视化，把"技能包里有哪些技能、它们如何组织"以 show-me 式的结构图直接呈现。第一版把"技能关系"限定为技能目录数据边界内已经存在、可验证的结构关系：技能包 → 技能方向 → 技能条目三层，以及每个技能条目的调用方式与状态标注；不虚构技能条目之间的连线，因为上游快照没有提供技能到技能的关系数据。

## Decisions

- 入口：技能目录区头部的「目录 / 关系图」视图切换，不新增页面、不改路由；关系图以 `view=graph` 进入工作台 URL 状态，与 q/group/lifecycle/skill 同级持久化，可直达、可分享。
- 数据：复用 `catalog.json` 的 workspace 标签配置与技能条目字段（group、invocationMode、lifecycle、command），由独立纯模块 `skill-relationship-graph.js` 计算布局并渲染内联 SVG；零外部依赖，不在页面组件中添加来源专属判断。
- 语义：方向节点按包配置的技能方向顺序排列；调用方式用底色区分（用户触发 = 蓝底，模型可调用 = 白底）；状态用边框与角标区分（已发布 = 实线无角标，实验中 = 金色角标，仓库内 = 空心角标）；图例只列出包内真正出现差异的维度，单一取值的维度不进图例。
- 交互：点击或键盘激活技能节点与目录行行为一致（选中、打开详情、同步 `skill` 参数）；搜索与筛选不改变关系图内容——关系图是整包的结构总览，不受过滤影响。
- 限制：技能条目之间的显式关系（如路由入口技能指向成员技能）需要上游提供数据，列为后续增强；画布按 900px 宽度计算，窄屏通过容器横向滚动查看，不缩放文字。

## Verification

纯函数布局由 `tests/skill-relationship-graph.test.mjs` 覆盖（完整覆盖每个技能、几何不越界、HTML 转义、图例维度、单技能包）；URL 状态由 `tests/package-workspace-state.test.mjs` 覆盖；浏览器行为（切换、点击、键盘、直达 URL、无横向溢出）由 `tests/e2e/package-workspace.test.cjs` 覆盖。
