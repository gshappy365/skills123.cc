// 站点结构的唯一来源：左侧导航、首页路线图、上/下篇、搜索都从这里读。
// 数据来自 content/site-index.json（由 tools/build_content.py 生成），页面正文在 content/pages/。
import { categories, groupItems, groupedItems, pages, href, index } from "../lib/content.js";

export const BRAND = "REA 新手教程";
export const BRAND_EN = "REA Handbook";
export const TAGLINE = "让 AI 帮你把别人的软件看懂，并且拿出证据";

/** 官方仓库：正文里需要引用原始文档时用。 */
export const REPO = "https://github.com/morluto/rea";
/** 框架参考：公开信息架构的来源，在「关于」页致谢。 */
export const FRAMEWORK = "https://github.com/nevertoday/xxd-pstack";

export const CATEGORY_META = {
  start: { icon: "Compass", short: "新手入门", sum: "三课 20 分钟，不会写代码也能走完" },
  guide: { icon: "Route", short: "完整教程", sum: "九步：架构、环境、安装、引擎、证据、命令行、重建、维护" },
  howto: { icon: "Wrench", short: "How-to 实操", sum: "一篇只讲一件事，每篇都带能照抄的一段话" },
  wiki: { icon: "BookOpen", short: "术语表", sum: "十二个概念：一句话、一个比方、一个误区" },
  faq: { icon: "Files", short: "常见问题", sum: "费用、上传、源码、引擎、会不会被目标骗" },
  reference: { icon: "Map", short: "站点资料", sum: "全景图、命令速查、引擎对照、十二个坑、关于本站" },
};

/** 左栏：每个栏目一个分组；How-to 再按四组折叠。 */
export const navGroups = categories.map((c) => ({
  id: c.id,
  label: c.label,
  count: c.count,
  short: CATEGORY_META[c.id]?.short ?? c.label,
  icon: CATEGORY_META[c.id]?.icon ?? "Files",
  sum: CATEGORY_META[c.id]?.sum ?? "",
  href: href("/" + c.id),
  items: groupItems(c.id).filter((p) => p.href !== "/" + c.id),
  subGroups: c.id === "howto" ? groupedItems("howto") : null,
}));

/** 顶栏右侧与页脚的站点资料链接。 */
export const siteLinks = [
  { href: href("/reference/flow"), label: "概念全景图" },
  { href: href("/reference/commands"), label: "命令速查" },
  { href: href("/reference/pitfalls"), label: "十二个坑" },
  { href: href("/reference/about"), label: "关于与致谢" },
];

/** 命令面板的轻索引（内联到每页）；更细的正文索引在 search-sections.json，按需加载。 */
export const searchItems = pages.map((p) => ({
  label: p.title,
  hint: p.category_label,
  keywords: String(p.description || p.excerpt || "").slice(0, 90),
  href: href(p.href),
}));

export const pageCount = pages.length;
/** 正文篇数：排除六个栏目首页（路径只有一段）。 */
export const articleCount = pages.filter((p) => p.href.split("/").filter(Boolean).length > 1).length;
export const generatedAt = index.generated_at;
