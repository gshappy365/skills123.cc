# SQL Queries — Data Plugin

> 所属插件：[Data](/plugins/data) · 来源：Anthropic knowledge-work-plugins · 兼容：Cowork + Claude Code

---

## 概述

SQL Queries 是 Data 插件中最核心的背景技能。它不是一个"教你写 SQL"的教程，而是一个**多方言 SQL 专家参考**——覆盖 PostgreSQL、Snowflake、BigQuery、Redshift、Databricks 五种主流数仓的语法差异、性能优化技巧和常见陷阱。当你在写查询、优化慢 SQL、在方言间翻译、或构建复杂分析查询时，它会自动激活。

与通用的 SQL 编辑器或 ORM 不同，这个技能**理解数仓之间的根本差异**——它知道 BigQuery 按字节计费所以应该避免 `SELECT *`，也知道 Snowflake 用 clustering keys 而不是传统索引。

---

## 基本信息

| 属性 | 值 |
|---|---|
| **技能名称** | `sql-queries` |
| **插件** | Data |
| **触发方式** | 自动（背景知识，无 slash 命令） |
| **用户可调用** | 否（作为其他技能的背景知识） |
| **官方源码** | [GitHub](https://github.com/anthropics/knowledge-work-plugins/tree/main/data/skills/sql-queries) |

### 触发短语

当出现以下场景时，技能自动激活：

- 写 SQL 查询（"帮我写个查询..."）
- 优化慢 SQL（"这个查询太慢了..."）
- 在方言间翻译（"把这个 Snowflake 查询改成 BigQuery..."）
- 构建复杂分析查询（CTEs、窗口函数、聚合）

---

## 架构设计

这个技能是一个**纯背景知识**技能——它不提供 slash 命令，而是作为 Data 插件中其他技能（如 `explore-data`、`analyze`）的知识底座。

```
┌─────────────────────────────────────────────────────────────────┐
│                      SQL QUERIES                                 │
├─────────────────────────────────────────────────────────────────┤
│  方言参考（5 种主流数仓）                                         │
│  ✓ PostgreSQL / Aurora / Supabase / Neon                        │
│  ✓ Snowflake                                                     │
│  ✓ BigQuery (Google Cloud)                                      │
│  ✓ Redshift (Amazon)                                            │
│  ✓ Databricks SQL                                               │
├─────────────────────────────────────────────────────────────────┤
│  通用模式库                                                      │
│  ✓ 窗口函数（排名、运行总计、LAG/LEAD）                          │
│  ✓ CTE 链式查询（可读性优化）                                     │
│  ✓ Cohort 留存分析                                               │
│  ✓ 漏斗分析                                                      │
│  ✓ 去重                                                          │
├─────────────────────────────────────────────────────────────────┤
│  调试与优化                                                      │
│  ✓ 方言特定陷阱                                                  │
│  ✓ EXPLAIN 计划解读                                              │
│  ✓ 性能优化清单                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 核心能力

### 1. 五方言参考

每个方言覆盖日期/时间、字符串、JSON/半结构化数据和性能优化。

**日期/时间对比**：

| 操作 | PostgreSQL | Snowflake | BigQuery |
|---|---|---|---|
| 当前时间 | `NOW()` | `CURRENT_TIMESTAMP()` | `CURRENT_TIMESTAMP()` |
| 加 7 天 | `+ INTERVAL '7 days'` | `DATEADD(day, 7, col)` | `DATE_ADD(col, INTERVAL 7 DAY)` |
| 截断到月 | `DATE_TRUNC('month', col)` | `DATE_TRUNC('month', col)` | `DATE_TRUNC(col, MONTH)` |
| 提取年份 | `EXTRACT(YEAR FROM col)` | `YEAR(col)` | `EXTRACT(YEAR FROM col)` |

**字符串/JSON 对比**：

| 操作 | PostgreSQL | Snowflake | BigQuery |
|---|---|---|---|
| 大小写不敏感匹配 | `ILIKE` | `ILIKE` | `LOWER(col) LIKE` |
| JSON 字段访问 | `data->>'key'` | `data:key::STRING` | `JSON_QUERY(data, '$.key')` |
| 正则匹配 | `~ 'pattern'` | `REGEXP_LIKE(col, 'pattern')` | `REGEXP_CONTAINS(col, r'pattern')` |

### 2. 通用模式库

**窗口函数**：
```sql
-- 排名
ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC)
RANK() OVER (PARTITION BY category ORDER BY revenue DESC)

-- 运行总计
SUM(revenue) OVER (ORDER BY date_col
  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as running_total

-- 移动平均（7 天）
AVG(revenue) OVER (ORDER BY date_col
  ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg_7d

-- 前后对比
LAG(value, 1) OVER (PARTITION BY entity ORDER BY date_col) as prev_value
LEAD(value, 1) OVER (PARTITION BY entity ORDER BY date_col) as next_value
```

**Cohort 留存分析**：
```sql
WITH cohorts AS (
  SELECT user_id, DATE_TRUNC('month', first_activity) as cohort_month FROM users
),
activity AS (
  SELECT user_id, DATE_TRUNC('month', activity_date) as activity_month FROM user_activity
)
SELECT c.cohort_month, COUNT(DISTINCT c.user_id) as cohort_size,
  COUNT(DISTINCT CASE WHEN a.activity_month = c.cohort_month THEN a.user_id END) as month_0,
  COUNT(DISTINCT CASE WHEN a.activity_month = c.cohort_month + INTERVAL '1 month' THEN a.user_id END) as month_1
FROM cohorts c LEFT JOIN activity a ON c.user_id = a.user_id
GROUP BY c.cohort_month ORDER BY c.cohort_month;
```

**漏斗分析**：
```sql
WITH funnel AS (
  SELECT user_id,
    MAX(CASE WHEN event = 'page_view' THEN 1 ELSE 0 END) as step_1,
    MAX(CASE WHEN event = 'signup_start' THEN 1 ELSE 0 END) as step_2,
    MAX(CASE WHEN event = 'signup_complete' THEN 1 ELSE 0 END) as step_3
  FROM events WHERE event_date >= CURRENT_DATE - 30
  GROUP BY user_id
)
SELECT COUNT(*) as total,
  SUM(step_1) as viewed, SUM(step_2) as started, SUM(step_3) as completed,
  ROUND(100.0 * SUM(step_2) / NULLIF(SUM(step_1), 0), 1) as view_to_start_pct
FROM funnel;
```

### 3. 方言特定陷阱

| 问题 | 说明 |
|---|---|
| BigQuery 无 `ILIKE` | 使用 `LOWER(col) LIKE '%pattern%'` |
| PostgreSQL 引号大小写敏感 | `"ColumnName"` 与 `columnname` 不同 |
| Snowflake VARIANT 访问 | 使用冒号语法 `data:key::TYPE` |
| Redshift 缺少 `PRIMARY KEY` 约束 | 分布键和排序键才是性能关键 |
| Databricks Delta Lake | 支持 `TIME TRAVEL` 和 `MERGE INTO` |

---

## 使用场景与案例

### 场景 1：方言翻译

**输入**：
```
帮我把这个 Snowflake 查询改成 BigQuery 版本。
```

**输出**：BigQuery 兼容的查询，自动替换 `ILIKE` 为 `LOWER() LIKE`、`DATEADD` 为 `DATE_ADD`、`SPLIT_PART` 为 `SPLIT` 等。

**关键价值**：不需要记住每种方言的细微差异，AI 自动处理语法转换。

### 场景 2：查询优化

**输入**：
```
这个查询跑得很慢，帮我看看怎么优化。
```

**输出**：分析查询计划，识别全表扫描、缺失索引、N+1 模式，给出具体优化建议和改写后的查询。

**关键价值**：AI 理解你的数仓类型（BigQuery 应减少扫描量，Snowflake 应利用 clustering keys），给出针对性的优化。

### 场景 3：复杂分析查询构建

**输入**：
```
帮我写一个用户留存 Cohort 分析查询，按注册月份分组，计算第 0、1、3 个月的留存率。
```

**输出**：完整的 CTE 链式查询，包含 cohorts 定义、活动匹配、留存率计算，适配你指定的方言。

**关键价值**：从自然语言到可执行查询，零手动编写。

---

## 与其他工具对比

| 维度 | SQL Queries（本技能） | dbt | 传统 SQL 编辑器 | 手动编写 |
|---|---|---|---|---|
| 方言支持 | 5 种内置 | 通过 adapter 支持 | 通常一种 | 需自行查阅文档 |
| 优化建议 | 上下文感知，理解数仓类型 | 仅模型层面 | 无 | 经验驱动 |
| 模式库 | 内置 Cohort/漏斗/去重 | 需自定义 macro | 无 | 需自行积累 |
| 学习成本 | 自然语言描述即可 | 需学 dbt 语法 | 需熟悉界面 | 无 |
| 输出速度 | 秒级 | 分钟级（需编译） | 手动编写 | 取决于复杂度 |

---

## 连接工具后的增强能力

| 连接的 MCP | 分类 | 增强效果 |
|---|---|---|
| **Snowflake** | 数据仓库 | 直接查询数据、获取表结构、探查 schema |
| **BigQuery** | 数据仓库 | 直接查询、预览查询成本、dry run |
| **Databricks** | 数据平台 | 直接查询 Unity Catalog、Delta Lake 表 |

连接方式：在 Data 插件的 `.mcp.json` 中配置对应的 MCP 服务器。

---

## 最佳实践

1. **指定方言** — 描述问题时带上你的数仓类型（"在 BigQuery 上..."），AI 会使用对应的语法和优化策略
2. **提供表结构** — 粘贴 `CREATE TABLE` 语句或 `DESCRIBE` 输出，AI 能写出更准确的查询
3. **说明数据量级** — "这张表有 5 亿行"会让 AI 更注意性能优化
4. **先用 `EXPLAIN`** — 让 AI 先分析查询计划再提优化建议，比凭空猜测更有效

---

## 参考链接

- [Data Plugin 完整文档](/plugins/data)
- [Anthropic 官方源码](https://github.com/anthropics/knowledge-work-plugins/tree/main/data/skills/sql-queries)
- [Standalone vs Supercharged](/concepts/standalone-vs-supercharged)
