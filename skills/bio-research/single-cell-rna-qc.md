# Single-Cell RNA QC — Bio-Research Plugin

> 所属插件：[Bio-Research](/plugins/bio-research) · 来源：Anthropic knowledge-work-plugins · 兼容：Cowork + Claude Code

---

## 概述

Single-Cell RNA QC 是 Bio-Research 插件中最实用的计算技能。它实现了**单细胞 RNA-seq 数据的自动化质量控制流程**，遵循 scverse 最佳实践，支持 MAD（中位数绝对偏差）基础的过滤和全面的可视化输出。与手动 QC 不同，这个技能将标准流程脚本化，支持 `.h5ad` 和 `.h5` 格式，适合批量处理和探索性分析。

---

## 基本信息

| 属性 | 值 |
|---|---|
| **技能名称** | `single-cell-rna-qc` |
| **插件** | Bio-Research |
| **触发方式** | 上下文触发 |
| **用户可调用** | 是 |
| **官方源码** | [GitHub](https://github.com/anthropics/knowledge-work-plugins/tree/main/bio-research/skills/single-cell-rna-qc) |

### 触发短语

- "帮我做单细胞数据的 QC"
- "过滤低质量细胞"
- "评估这个 scRNA-seq 数据质量"

---

## 核心能力

### 1. 输入格式支持

| 格式 | 来源 | 处理方式 |
|---|---|---|
| `.h5ad` | AnnData（scanpy/Python 工作流） | 直接加载 |
| `.h5` | 10X Genomics Cell Ranger 输出 | 自动检测并转换 |

### 2. QC 流程

**Approach 1：完整 QC 流水线（推荐）**

```bash
python3 scripts/qc_analysis.py input.h5ad
# 或
python3 scripts/qc_analysis.py raw_feature_bc_matrix.h5
```

自动执行：
1. 加载数据（自动检测格式）
2. 计算 QC 指标（基因数、UMI 数、线粒体比例）
3. MAD 基础的异常值检测和过滤
4. 生成可视化报告

**Approach 2：自定义过滤**

用户可指定自定义阈值，替代 MAD 默认值。

### 3. 可视化输出

| 图表类型 | 用途 |
|---|---|
| 小提琴图 | 过滤前后指标分布对比 |
| 散点图 | 基因数 vs UMI 数，异常值标记 |
| 条形图 | 过滤掉的细胞数量和原因 |
| PCA 图 | 过滤后的数据概览 |

---

## 使用场景

### 场景 1：标准 QC 流程

**输入**：
```
帮我做这个 10X 数据的 QC，文件是 raw_feature_bc_matrix.h5。
```

**输出**：自动运行完整 QC 流水线，输出过滤后的数据和可视化报告。

**关键价值**：从手动写 scanpy 脚本到一句话运行，QC 流程标准化、可重复。

### 场景 2：自定义阈值过滤

**输入**：
```
用我的阈值做 QC：每个细胞至少 500 个基因，线粒体比例不超过 15%。
```

**输出**：使用指定阈值的 QC 分析，对比默认阈值和自定义阈值的结果差异。

---

## 参考链接

- [Bio-Research Plugin 完整文档](/plugins/bio-research)
- [Anthropic 官方源码](https://github.com/anthropics/knowledge-work-plugins/tree/main/bio-research/skills/single-cell-rna-qc)
