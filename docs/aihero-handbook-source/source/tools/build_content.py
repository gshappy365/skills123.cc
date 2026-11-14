# -*- coding: utf-8 -*-
"""由 wigolo 抓取的 aihero.dev 全站内容生成 content/pages/**/index.md 与 content/site-index.json。

用法：python3 tools/build_content.py
数据源：WIGOLO/pages/（由 wigolo crawl + fetch 生成，frontmatter 含 title/url/description）。

清洗原则：
- 去掉原站样板：订阅 CTA、Share 块、词典页面包屑/作者头像行
- 站内链接（https://www.aihero.dev/…）改写为本站对应页面；未收录的链接保留原址
- 每页 frontmatter 保留 source（原站 URL），正文渲染时在页头展示来源
"""
import json
import re
import shutil
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
PAGES_DIR = CONTENT / "pages"

WIGOLO = Path("/Users/gaoshan/WorkBuddy/craft-anything/.workbuddy/craft/aihero-learn/wigolo/pages")
ORIGIN = "https://www.aihero.dev"

# 归入「学习地图」栏目的路线页
MOVE_TO_MAP = {
    "/learn", "/llm-fundamentals", "/ai-engineer-roadmap",
    "/model-context-protocol-tutorial", "/vercel-ai-sdk-tutorial", "/the-home-repo-pattern",
}

CATEGORIES = [
    dict(id="map", label="学习地图", order=1,
         title="学习地图：按问题找路径",
         nav="学习地图",
         desc="原站 /learn 的地图页与四条系统性路线：LLM 基础、AI 工程师路线图、MCP 教程、Vercel AI SDK 教程。",
         home=""),
    dict(id="articles", label="深度文章", order=2,
         title="深度文章：AI 编程的思路与方法",
         nav="深度文章",
         desc="Matt Pocock 的博客正文：提示词、评估、Agent 模式、Claude Code 实战、工作流设计。",
         home=""),
    dict(id="skills", label="技能库", order=3,
         title="技能库：可安装的 AI 编码技能",
         nav="技能库",
         desc="31 个可安装技能的官方页：/grill-me、/implement-spec、/tdd、/code-review 等，含安装命令与说明。",
         home=""),
    dict(id="dictionary", label="AI 编码词典", order=4,
         title="AI 编码词典：一句话讲清一个概念",
         nav="AI 编码词典",
         desc="70+ 个 AI 编码术语的准确定义：harness、context window、compaction、progressive disclosure……",
         home=""),
    dict(id="sandcastle", label="Sandcastle 文档", order=5,
         title="Sandcastle：云端沙箱跑 Agent",
         nav="Sandcastle 文档",
         desc="Sandcastle 工具的官方文档：核心概念、沙箱提供方、分支策略、Agent 会话。",
         home=""),
    dict(id="workshops", label="工作坊", order=6,
         title="工作坊：成体系的课程",
         nav="工作坊",
         desc="AI Coding Crash Course 与 AI SDK v6 Crash Course 的课程页。",
         home=""),
]

# wigolo 路径段 → 栏目与 slug 的映射规则在 classify()；这里只放栏目首页的导语正文。
CAT_HOME_BODY = {
    "map": """这一栏对应原站的「地图」与系统性路线。想按问题找答案，从[学习地图](/map/learn/)开始；想成体系地学，四条路线各有侧重：

- [LLM Fundamentals](/map/llm-fundamentals/)：模型、token、工具调用这些底层概念。
- [AI Engineer Roadmap](/map/ai-engineer-roadmap/)：从会用到能就业的能力地图。
- [MCP 教程](/map/model-context-protocol-tutorial/)：把外部工具接进 Agent 的标准协议。
- [Vercel AI SDK 教程](/map/vercel-ai-sdk-tutorial/)：用 TypeScript 给应用接模型。

下面列出本栏全部页面。""",
    "articles": """Matt Pocock 博客的正文归档，按原站标题排列。多数文章 5–15 分钟读完，
讲的是「怎么把 AI 编码用好」的判断与做法：提示词怎么写、评估怎么做、Agent 模式怎么选、
Claude Code 的钩子和技能怎么配。装了技能之后想知道为什么这么设计，来这里查。
下面列出本栏全部文章。""",
    "skills": """原站每个技能一个页面，写清它解决什么问题、怎么安装、什么时候用。
安装命令基本统一：`npx skills@latest add mattpocock/skills`。页面里保留原站给的用法示例。
下面列出本栏全部技能。""",
    "dictionary": """AI 编码词典的完整词条。每个词条都是一句话定义 + 展开 + 用法示例，
是原站最值得收藏的部分：拿不准 harness、compaction、progressive disclosure 这类词的时候，
按 ⌘K 搜词条名最快。下面列出全部词条。""",
    "sandcastle": """Sandcastle 是原站配套的云端沙箱工具，文档覆盖核心概念、沙箱提供方、
分支策略与 Agent 会话。下面列出全部文档页。""",
    "workshops": """原站的成体系课程页。课程本体在原站，这里保留课程的结构与说明。
下面列出全部工作坊。""",
}

ABOUT_BODY = """本站是 **AI Hero（aihero.dev）** 的非官方中文翻译存档，由 [Skills123](https://skills123.cc/) 整理。

- **内容来源**：2026-11-14 用 wigolo 对 https://www.aihero.dev/learn 做的全站抓取，共 200+ 页（文章、技能、词典、Sandcastle 文档、工作坊）。
- **版权说明**：原文版权归 **Matt Pocock / AI Hero** 所有。本站为非商业的中文翻译存档：正文由 AI 辅助翻译为简体中文，翻译仅供学习参考，如有出入请以每页「原文」链接指向的英文原文为准。觉得内容有用请去原站订阅支持作者。
- **结构**：六个栏目——学习地图、深度文章、技能库、AI 编码词典、Sandcastle 文档、工作坊。原站的站内链接已改写为本站对应页面；未收录的链接保留原址。
- **更新**：内容是静态快照，不会自动同步原站。想看最新内容请访问[原站](https://www.aihero.dev/)。

框架基于公开的 xxd-pstack 教程方法（Astro + XXD UI Kit 骨架），与 AI Hero 官方无关。"""

TAG_RE = re.compile(r"<[^>]+>")
MD_RE = re.compile(r"[`*_>#\-|]")

# 原站样板块（按块剔除）
BOILER = [
    re.compile(r"## Want more than vocabulary\?[\s\S]*?(?=\n## |\n\*\*Share\*\*|\Z)"),
    re.compile(r"## Join 135,[\s\S]*?(?=\n## |\n\*\*Share\*\*|\Z)"),
    re.compile(r"\n\*\*Share\*\*[\s\S]*?(?=\n#{1,3} |\Z)"),
    re.compile(r"^No spam\. Unsubscribe anytime\.\s*$", re.M),
    re.compile(r"^\[AI Coding Dictionary\]\(https://www\.aihero\.dev/ai-coding-dictionary\)\s*$", re.M),
    re.compile(r"^!\[Matt Pocock\]\([^)]*\)\s*$", re.M),
    re.compile(r"^Matt Pocock\s*$", re.M),
    # 词典页的上一篇/下一篇导航（单行合并链接）
    re.compile(r"^\[Previous term[^\n]*$", re.M),
    # 词典页的分类标签行
    re.compile(r"^Tools & Environment\s*$", re.M),
]


def plain(text: str) -> str:
    s = TAG_RE.sub(" ", text)
    s = re.sub(r"\[\[([^|\]]+)\|([^\]]+)\]\]", r"\1", s)
    s = s.replace("==", "").replace("++", "")
    s = MD_RE.sub(" ", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def parse_frontmatter(text: str):
    m = re.match(r"^---\n(.*?)\n---\n\n?", text, re.S)
    if not m:
        return {}, text
    fm = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, _, v = line.partition(":")
            fm[k.strip()] = v.strip()
    return fm, text[m.end():]


def classify(url_path: str):
    """按原站 URL 路径分类 → (category, slug)。返回 None 表示跳过。"""
    path = url_path.rstrip("/") or "/"
    if path == "/":
        return None  # 站点首页，不收录
    if path == "/newsletter":
        return None
    if path == "/skills":
        return ("skills", None)  # 栏目首页
    if path == "/sandcastle":
        return ("sandcastle", None)  # 栏目首页
    if path.startswith("/skills/"):
        slug = path[len("/skills/"):]
        if slug == "subscribe":
            return None
        if slug.startswith("skills-changelog-"):
            slug = "changelog-" + slug[len("skills-changelog-"):]
        return ("skills", slug)
    if path.startswith("/skills-"):
        slug = path[1:][len("skills-"):]
        if slug.startswith("changelog-"):
            slug = "changelog-" + slug  # 保留 changelog 前缀命名
        return ("skills", slug)
    if path == "/ai-coding-dictionary":
        return ("map", "ai-coding-dictionary")
    if path.startswith("/ai-coding-dictionary/"):
        return ("dictionary", path[len("/ai-coding-dictionary/"):])
    if path.startswith("/sandcastle/"):
        return ("sandcastle", path[len("/sandcastle/"):])
    if path.startswith("/workshops"):
        slug = path[len("/workshops"):].strip("/") or "index"
        return ("workshops", slug)
    if path == "/learn" or path in MOVE_TO_MAP:
        return ("map", path.lstrip("/"))
    return ("articles", path.lstrip("/"))


# dictionary 目录首页单独成 map 里的入口
DICT_INDEX_URL = ORIGIN + "/ai-coding-dictionary"


def load_pages():
    """读取 wigolo 全部页面 → list[dict(cat, slug, title, desc, url, body, chars)]。按 URL 去重取内容最长的一份。"""
    by_url = {}
    for f in sorted(WIGOLO.glob("**/*.md")):
        rel = str(f.relative_to(WIGOLO))
        text = f.read_text(encoding="utf-8")
        fm, body = parse_frontmatter(text)
        url = fm.get("url", "")
        if not url.startswith(ORIGIN):
            continue
        prev = by_url.get(url)
        if prev is not None:
            if len(body) <= prev["chars"]:
                continue
        cls = classify(url.replace(ORIGIN, "") or "/")
        if cls is None:
            continue
        cat, slug = cls
        title = (fm.get("title") or slug or "未命名").strip()
        desc = (fm.get("description") or "").strip()
        by_url[url] = dict(cat=cat, slug=slug, title=title, desc=desc, url=url,
                           body=body, chars=len(body), rel=rel)
    return list(by_url.values())


def build_link_map(records):
    """url 路径 → 本站 href（不含 base）。"""
    m = {}
    for r in records:
        path = r["url"].replace(ORIGIN, "") or "/"
        if r["slug"]:
            m[path.rstrip("/")] = f"/{r['cat']}/{r['slug']}/"
        else:  # /skills 栏目首页
            m[path.rstrip("/")] = f"/{r['cat']}/"
    return m


def rewrite_links(body: str, link_map):
    """站内链接改写为本站页面；未收录的保留原址。"""

    def abs_sub(m):
        path = m.group(1).replace(ORIGIN, "").rstrip("/") or "/"
        return "](" + link_map.get(path, m.group(1)) + ")"

    def rel_sub(m):
        path = m.group(1).rstrip("/")
        if path in link_map:
            return "](" + link_map[path] + ")"
        # 未收录的本站路径（如 /cohorts/…）还原为原站绝对地址，避免站内死链
        return "](" + ORIGIN + path + "/)"

    body = re.sub(r"\]\((https://www\.aihero\.dev[^)]*)\)", abs_sub, body)
    body = re.sub(r"\]\((/[^)]*)\)", rel_sub, body)
    return body


def clean(body: str) -> str:
    for pat in BOILER:
        body = pat.sub("", body)
    body = re.sub(r"\n{3,}", "\n\n", body)
    return body.strip()


def minutes(chars: int) -> int:
    return max(1, round(chars / 1200))


def write_page(path: Path, title: str, desc: str, body: str, source: str = "") -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fm = f"---\ntitle: {json.dumps(title, ensure_ascii=False)}\ndescription: {json.dumps(desc, ensure_ascii=False)}\n"
    if source:
        fm += f"source: {source}\n"
    fm += "---\n\n"
    path.write_text(fm + f"# {title}\n\n" + body.strip() + "\n", encoding="utf-8")


def main() -> None:
    if not WIGOLO.exists():
        raise SystemExit(f"数据源不存在：{WIGOLO}")
    if PAGES_DIR.exists():
        shutil.rmtree(PAGES_DIR)
    PAGES_DIR.mkdir(parents=True, exist_ok=True)

    records = load_pages()
    link_map = build_link_map(records)

    pages = []
    cats = []
    order = {c["id"]: 0 for c in CATEGORIES}

    for cat in CATEGORIES:
        cid = cat["id"]
        items = sorted([r for r in records if r["cat"] == cid],
                       key=lambda r: (r["slug"] or ""))
        write_page(PAGES_DIR / cid / "index.md", cat["title"], cat["desc"], CAT_HOME_BODY[cid])
        pages.append(dict(
            href=f"/{cid}", file=f"/content/pages/{cid}/index.md",
            title=cat["title"], nav_title=cat["nav"], description=cat["desc"],
            excerpt=cat["desc"], category=cid, category_label=cat["label"],
            reading_minutes=2, nav_order=0, search_text=plain(cat["desc"])[:700],
            group="", source="",
        ))

        for r in items:
            if r["slug"] is None:  # /skills 首页已在上面处理
                continue
            body = clean(rewrite_links(r["body"], link_map))
            desc = r["desc"] or plain(body)[:120]
            slug = r["slug"]
            write_page(PAGES_DIR / cid / slug / "index.md", r["title"], desc, body, r["url"])
            order[cid] += 1
            pages.append(dict(
                href=f"/{cid}/{slug}", file=f"/content/pages/{cid}/{slug}/index.md",
                title=r["title"], nav_title=r["title"], description=desc,
                excerpt=desc, category=cid, category_label=cat["label"],
                reading_minutes=minutes(r["chars"]), nav_order=order[cid],
                search_text=plain(body)[:700], group="", source=r["url"],
            ))

        # /skills 栏目首页本体（/skills 原页面的正文拼在导语后）
        skills_home = next((r for r in records if r["cat"] == "skills" and r["slug"] is None), None)
        if cid == "skills" and skills_home:
            body = clean(rewrite_links(skills_home["body"], link_map))
            write_page(PAGES_DIR / cid / "index.md", cat["title"], cat["desc"],
                       CAT_HOME_BODY[cid] + "\n\n---\n\n" + body, skills_home["url"])

        cats.append(dict(id=cid, label=cat["label"], order=cat["order"],
                         count=len(items) + 1))

    # map 栏目补「关于本站」
    write_page(PAGES_DIR / "map" / "about" / "index.md",
               "关于本站与版权说明", "内容来源、版权归属与结构说明。", ABOUT_BODY)
    pages.append(dict(
        href="/map/about", file="/content/pages/map/about/index.md",
        title="关于本站与版权说明", nav_title="关于本站",
        description="内容来源、版权归属与结构说明。", excerpt="内容来源、版权归属与结构说明。",
        category="map", category_label="学习地图", reading_minutes=2,
        nav_order=99, search_text=plain(ABOUT_BODY)[:700], group="", source="",
    ))

    latest = ["/map/learn", "/map/llm-fundamentals", "/skills/tdd",
              "/dictionary/harness", "/articles/what-is-an-llm", "/articles/plan-mode-introduction"]
    known = {p["href"] for p in pages}
    latest = [h for h in latest if h in known]

    index = dict(
        generated_at=datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        page_count=len(pages), categories=cats, pages=pages,
        latest=[{"href": h} for h in latest],
    )
    (CONTENT / "site-index.json").write_text(
        json.dumps(index, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"pages: {len(pages)} / categories: {len(cats)}")
    for c in cats:
        print(f"  {c['id']:<12} {c['count']:>3} 页")


if __name__ == "__main__":
    main()
