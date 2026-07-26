---
source_url: "https://shopify.baoea.com/advanced/us-sales-tax-guide"
title: "Shopify 独立站搭建实战 & 建站咨询服务｜Shopify建站教程"
fetched_at: "2026-07-26 05:41:52"
fetch_method: "http"
content_hash: "1238dde6c76825d7023f2e259dfd67e113a66a8f4484c683e2ec3b46d442cffa"
discovered_via: ["sitemap", "internal_link"]
---
美国销售税（Sales Tax）是 Shopify 跨境卖家**最被忽视、踩坑最贵**的合规项。三个常见误判会带来真实风险：

*   误判一：**“没在美国实体，不用收税”** —— 2018 年 Wayfair 判决后，**Economic Nexus** 让所有越境卖家都可能触发
*   误判二：**“Shopify 会自动报税”** —— Shopify 只**计算 + 代收**，**不会代缴**到各州税局
*   误判三：**“用一个 App 就能搞定 50 州”** —— Nexus 注册、合规申报仍需人工或专业服务

本文按”**判定 → 注册 → Shopify 配置 → 工具 → 报税 → 维护**”的实施顺序展开。先看下表速查 Nexus 门槛，再决定要不要展开读。

### Nexus 门槛速查（46 个征税州 + DC）[](https://shopify.baoea.com/advanced/us-sales-tax-guide#nexus-%E9%97%A8%E6%A7%9B%E9%80%9F%E6%9F%A546-%E4%B8%AA%E5%BE%81%E7%A8%8E%E5%B7%9E--dc)

| 维度 | 多数州通用 | 显著例外 |
| --- | --- | --- |
| 金额门槛 | $100,000 / 12 个月 | 加州、纽约、德州为 $500,000 |
| 交易笔数门槛 | 200 笔 / 12 个月 | 部分州已取消笔数门槛（仅看金额） |
| 触发后注册期限 | 30–90 天 | 因州而异 |
| 回溯期 | 通常无 | 个别州可能要求补缴触发后的部分税款 |
| Marketplace Facilitator | 通过 Amazon / eBay / Walmart 等平台的销售由平台代缴 | 独立站不适用，需自行处理 |

**5 个免税州**（不征收州级销售税）：阿拉斯加、特拉华、蒙大拿、新罕布什尔、俄勒冈。其中**阿拉斯加部分地区征地方税**。

> **重要提示**：美国销售税规则因州而异且经常变化。本文为通用框架，**正式合规决策务必咨询持照税务顾问 / CPA**。详细的跨境税务综览见 [跨境独立站税费处理](https://shopify.baoea.com/advanced/cross-border-tax-guide)。

## 一、美国销售税基础知识[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E4%B8%80%E7%BE%8E%E5%9B%BD%E9%94%80%E5%94%AE%E7%A8%8E%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86)

### 什么是销售税[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E4%BB%80%E4%B9%88%E6%98%AF%E9%94%80%E5%94%AE%E7%A8%8E)

销售税（Sales Tax）是在销售点征收的税费，由州级和地方政府征收。目前美国有45个州和华盛顿特区要求电商卖家收取销售税。

**关键特点**：

*   州级和地方政府征收，税率因地区而异
*   一般由消费者承担，商家负责代收代缴
*   不同州有不同的税率和规则
*   需要根据Economic Nexus判断是否需要注册

### 你需要获得销售税许可证[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E4%BD%A0%E9%9C%80%E8%A6%81%E8%8E%B7%E5%BE%97%E9%94%80%E5%94%AE%E7%A8%8E%E8%AE%B8%E5%8F%AF%E8%AF%81)

\*\*Economic Nexus（经济联系）\*\*是针对在美国的州没有实体的公司的税法，这些公司进行电商业务。每个州有分别针对卖家设置相应的纳税门槛，大部分销售税起征点为年销售额10万美元或200笔交易，各州的这一基准会每年进行调整。

当你达到某个州的征税起点后，你就要注册销售税许可证。在此之前，你要登录美国财政部网站查看你所在州的规定条款（例如，是否需要续签）。

不同州的销售税许可证名称不同（例如税收许可证、卖家许可证等），但注册过程都一样，而且在大多数州都可以免费注册销售税许可证。

**注册步骤**：

1.  **注册你的公司**：确保公司已合法注册。
    
2.  **申请联邦税号（EIN）**：如果需要，请通过IRS（美国国税局）申请联邦税号（EIN）。
    
3.  **填写注册表格**：该表格一般会询问你的公司主要业务、成立时间以及联系方式。
    
4.  **提交申请**：向目标州的税务部门提交申请。
    

**重要提示**：即使你仅在线上进行销售，你仍需要有销售税许可证。在你开展业务的每个州都需要有许可证。如公司注册地在A州，但库存在B州，那么你就需要两个州的许可证。

### 不是全部州都要求你收取销售税[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E4%B8%8D%E6%98%AF%E5%85%A8%E9%83%A8%E5%B7%9E%E9%83%BD%E8%A6%81%E6%B1%82%E4%BD%A0%E6%94%B6%E5%8F%96%E9%94%80%E5%94%AE%E7%A8%8E)

目前，美国有45个州和华盛顿特区要求电商卖家依据”Economic Nexus”收取销售税。Shopify销售税设置之所以复杂，是因为不同的州费率不完全相同。

**免税州**（5个州不征收州级销售税）：

*   阿拉斯加州（部分地区征收地方税）
*   特拉华州
*   蒙大拿州
*   新罕布什尔州
*   俄勒冈州

### 汇款频率因州而异[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E6%B1%87%E6%AC%BE%E9%A2%91%E7%8E%87%E5%9B%A0%E5%B7%9E%E8%80%8C%E5%BC%82)

税收汇款是指将你收取的销售税上交给IRS的过程，这在各州之间也有所不同。一旦注册了销售税许可证，你就必须按月、季度或每年缴纳所收取的税款。上缴频率取决于不同的州的规定。

**常见汇款频率**：

*   **月度**：大多数州要求销售额较大的商家按月缴纳
*   **季度**：中等销售额的商家通常按季度缴纳
*   **年度**：销售额较小的商家可能按年缴纳

**注意**：汇款频率可能随销售额变化而调整，需要定期检查各州要求。

### 销售税计算方式：目的地基准 vs 来源地基准[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E9%94%80%E5%94%AE%E7%A8%8E%E8%AE%A1%E7%AE%97%E6%96%B9%E5%BC%8F%E7%9B%AE%E7%9A%84%E5%9C%B0%E5%9F%BA%E5%87%86-vs-%E6%9D%A5%E6%BA%90%E5%9C%B0%E5%9F%BA%E5%87%86)

根据你所在的州的不同，销售税的计算方式分以下两种：

#### 目的地基准（Destination-basis）[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E7%9B%AE%E7%9A%84%E5%9C%B0%E5%9F%BA%E5%87%86destination-basis)

Shopify销售税是根据每个商家所在的位置计算的。如果你在密歇根州向缅因州的客户出售产品，则销售税将基于缅因州的税率计算。

**适用州**：大多数州使用目的地基准。

#### 来源地基准（Origin-basis）[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E6%9D%A5%E6%BA%90%E5%9C%B0%E5%9F%BA%E5%87%86origin-basis)

Shopify销售税是根据你所在的位置计算的。如果你在纽约州将产品卖给犹他州的客户，则销售税是根据纽约州的税率计算的。

**使用来源地税制的州**（12个州）：

*   亚利桑那州
*   伊利诺伊州
*   加利福尼亚州
*   俄亥俄州
*   密西西比州
*   密苏里州
*   新墨西哥州
*   宾夕法尼亚州
*   犹他州
*   田纳西州
*   德州
*   维吉尼亚州

## 二、Shopify销售税设置步骤[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E4%BA%8Cshopify%E9%94%80%E5%94%AE%E7%A8%8E%E8%AE%BE%E7%BD%AE%E6%AD%A5%E9%AA%A4)

### 步骤1：设置运送区域[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E6%AD%A5%E9%AA%A41%E8%AE%BE%E7%BD%AE%E8%BF%90%E9%80%81%E5%8C%BA%E5%9F%9F)

因为不同的州和城市税率不同，所以要为每个州创建一个运输区域。如果你处于按照目的地基准计算销售税的状态，那么则此功能就会给你比较大的帮助。

**操作路径**：

```
设置 → 运输 → 运送区域 → 添加运送区域
```

**操作步骤**：

1.  点击”添加运送区域”
2.  为你的运送区域编辑名称（例如，国家/地区名称）
3.  添加相应的国家（地区），将运送区域中的所有国家都添加到里面
4.  保存设置

### 步骤2：设定税率[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E6%AD%A5%E9%AA%A42%E8%AE%BE%E5%AE%9A%E7%A8%8E%E7%8E%87)

为所创建的各个运送区域设置税率。Shopify可以自动设置销售税率，避免造成混乱。

**操作步骤**：

1.  **设置Location**
    
    ```
    设置 → 常规
    ```
    
    在此处设置你的location（实际经营地址）。即使你仅仅是在做线上业务，也要为你的商店输入实际位置。Shopify需要用到此信息，以帮助其自动按目的地基准/按来源地基准计算销售税。
    
2.  **添加税率**
    
    ```
    设置 → 税收
    ```
    
    点击进入”设置” → “税收”添加税率。最好将这些税设置为自动计算，以便Shopify根据州、县和地方税规定对其进行管理。
    
3.  **启用自动税率计算**
    
    *   启用Shopify自动税率计算
    *   选择适用的州
    *   Shopify会自动使用最新的税率

**重要提示**：建议你每年对这些税率进行检查，确保Shopify是用最新税率计算销售税。

### 步骤3：设置免税[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E6%AD%A5%E9%AA%A43%E8%AE%BE%E7%BD%AE%E5%85%8D%E7%A8%8E)

要设置免税，你需要对免税产品单独设置一个系列。

**操作步骤**：

1.  **创建免税系列**
    
    ```
    产品 → 系列 → 创建系列
    ```
    
    为免税产品创建一个系列，为其命名和保存。
    
2.  **设置税收改写**
    
    ```
    设置 → 税收
    ```
    
    选中一个免税国家，这是在告诉Shopify免税规则需要运用在哪里。
    
3.  **添加税收改写**
    
    *   在新窗口中单击”税收改写”
    *   单击”添加税收改写”
    *   从下拉菜单中选择上述创建的免费系列
4.  **选择免税地点和费率**
    
    *   选择免税适用的地点和费率
    *   点击”添加改写”

**免税商品示例**：

*   纽约对售价低于110美元的服装免税
*   各州对食品、药品等可能有免税政策
*   需要了解各州的免税商品规定

### 步骤4：在结账页面显示销售税[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E6%AD%A5%E9%AA%A44%E5%9C%A8%E7%BB%93%E8%B4%A6%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA%E9%94%80%E5%94%AE%E7%A8%8E)

在结帐页面中将销售税作为单独的一项列出，让客户清楚了解自己的订单所包含的税费。这有助于提升透明度，减少客户疑虑。

**注意事项**：

*   请注意一部分州还要求对你的运输成本进行征税
*   确保税费显示清晰明确
*   在订单确认邮件中也应显示税费明细

## 三、利用自动化软件简化销售税追踪[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E4%B8%89%E5%88%A9%E7%94%A8%E8%87%AA%E5%8A%A8%E5%8C%96%E8%BD%AF%E4%BB%B6%E7%AE%80%E5%8C%96%E9%94%80%E5%94%AE%E7%A8%8E%E8%BF%BD%E8%B8%AA)

因为Shopify不会帮你向IRS汇税，因此你要追踪自己的的税费欠款，包括时间、以何种方式汇缴税款。

但是，由于汇款是由Shopify平台处理的，所以可以借助Shopify提供的相关报表来降低报税时的麻烦，尤其是当你需要每月或每季度频繁汇缴税款时，这些报表能给你很大帮助。

### Shopify税务申报报告[](https://shopify.baoea.com/advanced/us-sales-tax-guide#shopify%E7%A8%8E%E5%8A%A1%E7%94%B3%E6%8A%A5%E6%8A%A5%E5%91%8A)

报税时，你可以用到的销售报告有很多种，例如，税务申报报告能够显示你在特定时间范围内收取的销售税数额。无论你的汇款频率如何，都可以通过输出此报告来满足你的需求。

**报告内容**：

*   从哪个国家和地区收取了销售税
*   税率和税收总额
*   按州分类的销售税数据

**使用方法**：

*   你的商店每处理一笔交易时，此报告都会自动更新以追踪你迄今为止所收取的销售税
*   此报告同时结合了按目的地基准和按来源地基准计算销售税
*   如果你使用的是Shopify自动税率计算器（定期更新），就可以确保此报告中的数据是准确的
*   从此报告中导出数据，然后将其发送给你的财务同事，即可在纳税时间进行相应的报税

**访问路径**：

```
Shopify Admin → 报告 → 销售 → 税务申报报告
```

### 第三方自动化工具[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E7%AC%AC%E4%B8%89%E6%96%B9%E8%87%AA%E5%8A%A8%E5%8C%96%E5%B7%A5%E5%85%B7)

由于计算销售税比较复杂，为了确保你收取的税额正确，可以使用一些插件帮助你避免出现错误。你可以使用与Shopify相关的税收插件，如TaxJar、Avalara和Quaderno等来简化你的收税过程。另外这些插件还可以提供自动报税功能。

#### TaxJar[](https://shopify.baoea.com/advanced/us-sales-tax-guide#taxjar)

由于不同的州和城市税率不同，TaxJar可帮助你追踪要收取的费用，以确保你纳税行为的合规性。Shopify可帮助你设置和收取销售税，但无法帮助你自动报税。

**主要功能**：

*   自动计算各州销售税
*   生成详细的数据报告，显示你所销售的每个州/国家/地区所收取的税款
*   自动报税功能（需付费版本）
*   不仅省时还能保证准确

**适用场景**：主要面向美国市场，专门针对电商优化。

**参考**：[TaxJar官网](https://www.taxjar.com/)  | [TaxJar Shopify应用](https://apps.shopify.com/taxjar) 

#### Avalara AvaTax[](https://shopify.baoea.com/advanced/us-sales-tax-guide#avalara-avatax)

Avalara能够自动化销售税的前期追踪和后续报税过程。它将对你产生的每笔交易进行追踪，并根据设置的报税要求将其自动添加到报告中。如果你要按月或按季度缴销售税，这些报告可以对你收取的销售税进行分类和整理。

**主要功能**：

*   自动计算和追踪销售税
*   自动生成报税报告
*   支持多州合规
*   覆盖全球税务规则，准确性高

**适用场景**：美国多州合规、全球税务管理。

**参考**：[Avalara官网](https://www.avalara.com/)  | [Avalara Shopify应用](https://apps.shopify.com/avalara-avatax) 

#### Quaderno[](https://shopify.baoea.com/advanced/us-sales-tax-guide#quaderno)

根据每个Shopify卖家的不同需求，Quaderno具备高度的自定义特点，你可以根据自己的需求进行设置，例如允许消费者查看其历史账单，以及在顾客发送账单请求时向其发送相关账目。

**主要功能**：

*   自动计算销售税
*   生成税务报告
*   高度自定义设置
*   客户账单管理

**适用场景**：需要自定义功能的商家。

**参考**：[Quaderno官网](https://quaderno.io/)  | [Quaderno Shopify应用](https://apps.shopify.com/quaderno) 

## 四、报税流程[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E5%9B%9B%E6%8A%A5%E7%A8%8E%E6%B5%81%E7%A8%8B)

### 收集销售税数据[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E6%94%B6%E9%9B%86%E9%94%80%E5%94%AE%E7%A8%8E%E6%95%B0%E6%8D%AE)

**数据来源**：

*   Shopify税务申报报告
*   第三方工具（如TaxJar、Avalara）生成的报告
*   支...

### 解锁完整内容

此内容仅限VIP会员访问。升级VIP会员即可解锁全部高级教程，获取独家主题代码和商业案例，享受专家1对1咨询服务。

#### 会员专享特权（感谢您的支持）：

*   🔓 解锁全部VIP教程与案例
*   💎 获取独家主题代码和最佳实践
*   🚀 新功能抢先体验、优先更新
*   💬 VIP专属交流社群、月度答疑
*   🎯 1对1专家咨询和定制开发优先级
*   📚 独家商业案例库和跨境电商资讯

**创作不易，您的支持是我前进的动力!**

### 我什么时候需要注册销售税许可证？

### Shopify会自动帮我报税吗？

### 目的地基准和来源地基准有什么区别？

### 我需要为所有州注册销售税许可证吗？

### 销售税汇款频率是固定的吗？

### 如何知道哪些商品是免税的？

### 如果我不收取销售税会有什么后果？

### 第三方税务工具的成本是多少？

## 七、实用资源[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E4%B8%83%E5%AE%9E%E7%94%A8%E8%B5%84%E6%BA%90)

### 官方资源[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E5%AE%98%E6%96%B9%E8%B5%84%E6%BA%90)

*   **各州税务部门网站**：查询各州销售税规定和注册要求
*   **IRS官网**：了解联邦税务要求
*   **Shopify Help - 销售税**：[Shopify销售税设置指南](https://help.shopify.com/en/manual/taxes) 

### 专业工具[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E4%B8%93%E4%B8%9A%E5%B7%A5%E5%85%B7)

*   **TaxJar**：[官网](https://www.taxjar.com/)  | [Shopify应用](https://apps.shopify.com/taxjar) 
*   **Avalara AvaTax**：[官网](https://www.avalara.com/)  | [Shopify应用](https://apps.shopify.com/avalara-avatax) 
*   **Quaderno**：[官网](https://quaderno.io/)  | [Shopify应用](https://apps.shopify.com/quaderno) 

### 参考资源[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E5%8F%82%E8%80%83%E8%B5%84%E6%BA%90)

*   **Sales Tax Institute**：销售税规则和最佳实践
*   **各州Economic Nexus门槛查询**：了解各州注册要求
*   **销售税计算器**：在线计算各州销售税

## 销售税合规节奏表（建议固化为 SOP）[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E9%94%80%E5%94%AE%E7%A8%8E%E5%90%88%E8%A7%84%E8%8A%82%E5%A5%8F%E8%A1%A8%E5%BB%BA%E8%AE%AE%E5%9B%BA%E5%8C%96%E4%B8%BA-sop)

| 频率 | 必做动作 |
| --- | --- |
| 每月 | 1) 各州销售额对照 Nexus 门槛；2) 已注册州的月度申报（如适用） |
| 每季度 | 1) 季度申报州的报税；2) 全部已注册州的税率更新核查 |
| 每半年 | 1) 接近门槛 80% 的州预警；2) Shopify 报告与第三方工具数据对账 |
| 每年 | 1) 全部 50 州 + DC 的 Economic Nexus 复评估；2) 注册州的年度申报；3) 与 CPA 复盘合规策略 |

**最容易忽略的两件事**：

1.  **Marketplace Facilitator**：通过 Amazon / eBay 的销售由平台代缴，**独立站不在此豁免范围**——很多卖家把两者混为一谈
2.  **本地税（City / County / District）**：除州税外，还有市县级附加税，可能让总税率从 6% 升到 9.5%（如加州部分城市），Shopify 自动税率会覆盖此层

* * *

## 延伸阅读[](https://shopify.baoea.com/advanced/us-sales-tax-guide#%E5%BB%B6%E4%BC%B8%E9%98%85%E8%AF%BB)

*   [跨境独立站税费处理](https://shopify.baoea.com/advanced/cross-border-tax-guide) — VAT / GST / 美国销售税 / 关税综览
*   [跨境店铺财务框架](https://shopify.baoea.com/advanced/currency-tax-management) — 多币种、汇率、申报税种的资金流
*   [跨境电商进阶](https://shopify.baoea.com/advanced/cross-border-advanced) — 市场选品、平台布局与合规整体框架
*   [GDPR 合规实施指南](https://shopify.baoea.com/advanced/gdpr-compliance-guide) — 欧盟数据合规（销售欧盟必读）
*   [全球物流方案与订单跟踪](https://shopify.baoea.com/advanced/global-logistics) — DDP / DDU 与税费的关系

* * *

> **免责声明**：本指南提供一般性信息，不构成税务或法律建议。美国各州销售税规则不同且经常变化，建议咨询熟悉美国销售税的**持照专业税务顾问 / CPA**，以获得针对您具体情况的专业建议。Wayfair 判决后的 Nexus 规则、各州门槛、Marketplace Facilitator 豁免范围都可能在年度立法窗口内调整。
