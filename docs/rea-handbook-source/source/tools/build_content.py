# -*- coding: utf-8 -*-
"""由内容模块生成 content/pages/**/*.md 与 content/site-index.json。

用法：python3 tools/build_content.py
"""
import json
import re
import shutil
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
PAGES_DIR = CONTENT / "pages"

from content_a import START, GUIDE
from content_b import HOWTO, FAQ_HOME
from content_c import (
    WIKI, REFERENCE,
    WIKI_HOME, REFERENCE_HOME, START_HOME, GUIDE_HOME, HOWTO_HOME,
)

CATEGORIES = [
    dict(id="start", label="新手入门", short="新手入门", order=1,
         title="新手入门：三课，二十分钟", nav="新手入门",
         desc="不会写代码也能走完：它值不值得学、怎么装上、第一次怎么问。",
         home=START_HOME, items=START),
    dict(id="guide", label="完整教程", short="完整教程", order=2,
         title="完整教程：九步，从装到能自己查", nav="完整教程",
         desc="架构、环境、安装、引擎、完整案子、证据、工具、命令行、重建、维护。",
         home=GUIDE_HOME, items=GUIDE),
    dict(id="howto", label="How-to 实操", short="How-to 实操", order=3,
         title="How-to：一篇只讲一件事", nav="How-to 实操",
         desc="看懂应用、找东西、发布检查、排错省钱，每篇都带能照抄的一段话。",
         home=HOWTO_HOME, items=HOWTO),
    dict(id="wiki", label="术语表", short="术语表", order=4,
         title="术语表：一句话、一个比方、一个误区", nav="术语表",
         desc="证据、覆盖、可信度、未知项、账本、引擎、目标、快照、引导、不可信内容、伪代码、运行时捕获。",
         home=WIKI_HOME, items=WIKI),
    dict(id="faq", label="常见问题", short="常见问题", order=5,
         title="常见问题", nav="常见问题",
         desc="要钱吗、会上传吗、能给源码吗、必须装 Ghidra 吗、会不会被目标骗。",
         home=FAQ_HOME, items=[]),
    dict(id="reference", label="站点资料", short="站点资料", order=6,
         title="站点资料：全景图、速查、坑", nav="站点资料",
         desc="概念全景图、命令与工具速查、引擎对照、十二个坑、适不适合你、关于本站。",
         home=REFERENCE_HOME, items=REFERENCE),
]

TAG_RE = re.compile(r"<[^>]+>")
MD_RE = re.compile(r"[`*_>#\-|]")


def plain(text: str) -> str:
    s = TAG_RE.sub(" ", text)
    s = re.sub(r"\[\[([^|\]]+)\|([^\]]+)\]\]", r"\1", s)
    s = s.replace("==", "").replace("++", "")
    s = MD_RE.sub(" ", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()


WIKI_LABEL = re.compile(r"^\*\*(一句话|打个比方|在 REA 里|常见误区)\*\*：(.+)$", re.M)


def normalize(cid: str, body: str) -> str:
    """术语表四段式：把加粗标签提到二级标题，右侧目录才读得出来。"""
    if cid != "wiki":
        return body
    return WIKI_LABEL.sub(lambda m: f"## {m.group(1)}\n\n{m.group(2)}", body)


def write_page(path: Path, title: str, desc: str, body: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    text = f"---\ntitle: {json.dumps(title, ensure_ascii=False)}\ndescription: {json.dumps(desc, ensure_ascii=False)}\n---\n\n# {title}\n\n{body.strip()}\n"
    path.write_text(text, encoding="utf-8")


def main() -> None:
    if PAGES_DIR.exists():
        shutil.rmtree(PAGES_DIR)
    PAGES_DIR.mkdir(parents=True, exist_ok=True)

    pages = []
    cats = []

    for cat in CATEGORIES:
        cid = cat["id"]
        home_desc = cat["desc"]
        write_page(PAGES_DIR / cid / "index.md", cat["title"], home_desc, cat["home"])
        pages.append(dict(
            href=f"/{cid}",
            file=f"/content/pages/{cid}/index.md",
            title=cat["title"],
            nav_title=cat["nav"],
            description=home_desc,
            excerpt=home_desc,
            category=cid,
            category_label=cat["label"],
            reading_minutes=3,
            nav_order=0,
            search_text=plain(cat["home"])[:700],
            group="",
        ))

        for item in cat["items"]:
            href = f"/{cid}/{item['slug']}"
            write_page(
                PAGES_DIR / cid / item["slug"] / "index.md",
                item["title"], item["desc"], normalize(cid, item["body"]),
            )
            pages.append(dict(
                href=href,
                file=f"/content/pages/{cid}/{item['slug']}/index.md",
                title=item["title"],
                nav_title=item.get("nav", item["title"]),
                description=item["desc"],
                excerpt=item["desc"],
                category=cid,
                category_label=cat["label"],
                reading_minutes=item.get("minutes", 5),
                nav_order=item.get("order", 99),
                search_text=plain(item["body"])[:700],
                group=item.get("group", ""),
            ))

        cats.append(dict(id=cid, label=cat["label"], order=cat["order"],
                         count=len(cat["items"]) + 1))

    latest = ["/start/1-what", "/start/3-first-task",
              "/guide/4-first-case", "/guide/5-evidence",
              "/reference/pitfalls", "/howto/electron-app"]

    index = dict(
        generated_at=datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        page_count=len(pages),
        categories=cats,
        pages=pages,
        latest=[{"href": h} for h in latest],
    )
    (CONTENT / "site-index.json").write_text(
        json.dumps(index, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )
    print(f"pages: {len(pages)} / categories: {len(cats)}")
    for c in cats:
        print(f"  {c['id']:<10} {c['count']:>2} 页")


if __name__ == "__main__":
    main()
