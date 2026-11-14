// 站点结构的唯一来源：左侧导航、首页卡片、上/下篇、搜索都从这里读。
// 数据来自 content/site-index.json（由 tools/build_content.py 生成），页面正文在 content/pages/。
import { categories, groupItems, groupedItems, pages, href, index } from "../lib/content.js";

export const BRAND = "AI Hero 学习手册";
export const BRAND_EN = "AI Hero Handbook";
export const TAGLINE = "aihero.dev 全站中文导读存档：学习地图、深度文章、技能库、AI 编码词典";

/** 原站：所有内容来自这里，版权归 Matt Pocock / AI Hero。 */
export const REPO = "https://www.aihero.dev";
/** 框架参考：公开信息架构的来源，在「关于」页致谢。 */
export const FRAMEWORK = "https://github.com/nevertoday/xxd-pstack";

export const CATEGORY_META = {
  map: { icon: "Map", short: "学习地图", sum: "按问题找路径：/learn 地图页 + 四条系统路线" },
  articles: { icon: "FileText", short: "深度文章", sum: "提示词、评估、Agent 模式、Claude Code 实战" },
  skills: { icon: "Puzzle", short: "技能库", sum: "31 个可安装技能：/grill-me、/tdd、/code-review……" },
  dictionary: { icon: "BookOpen", short: "AI 编码词典", sum: "70+ 个术语：一句话定义 + 展开 + 用法示例" },
  sandcastle: { icon: "Boxes", short: "Sandcastle 文档", sum: "云端沙箱跑 Agent：概念、提供方、分支、会话" },
  workshops: { icon: "Presentation", short: "工作坊", sum: "AI Coding 与 AI SDK v6 两套 Crash Course" },
};

/** 左栏：每个栏目一个分组；地图栏目按「路线」分组。 */
export const navGroups = categories.map((c) => ({
  id: c.id,
  label: c.label,
  count: c.count,
  short: CATEGORY_META[c.id]?.short ?? c.label,
  icon: CATEGORY_META[c.id]?.icon ?? "Files",
  sum: CATEGORY_META[c.id]?.sum ?? "",
  href: href("/" + c.id),
  items: groupItems(c.id).filter((p) => p.href !== "/" + c.id && p.href !== "/map/about"),
  subGroups: null,
}));

/** 顶栏右侧与页脚的站点资料链接。 */
export const siteLinks = [
  { href: href("/map/learn"), label: "学习地图（原文）" },
  { href: href("/map/ai-coding-dictionary"), label: "词典总目录" },
  { href: href("/map/about"), label: "关于与版权说明" },
];

/** 命令面板的轻索引（内联到每页）；更细的正文索引在 search-sections.json，按需加载。 */
export const searchItems = pages.map((p) => ({
  label: p.title,
  hint: p.category_label,
  keywords: String(p.description || p.excerpt || "").slice(0, 90),
  href: href(p.href),
}));

export const pageCount = pages.length;
/** 正文篇数：排除六个栏目首页。 */
export const articleCount = pages.filter((p) => p.href.split("/").filter(Boolean).length > 1).length;
export const generatedAt = index.generated_at;
