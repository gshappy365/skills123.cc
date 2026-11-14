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
         title="新手入门：三课，20 分钟", nav="新手入门",
         desc="不会写代码也能顺着走完的三课：它能帮你什么、怎么装上、第一次派活。",
         home=START_HOME, items=START),
    dict(id="guide", label="完整教程", short="完整教程", order=2,
         title="完整教程：九步把它真正跑起来", nav="完整教程",
         desc="从边界与原则，到安装、授权、面板、工单生命周期、审阅合并与升级。",
         home=GUIDE_HOME, items=GUIDE),
    dict(id="howto", label="How-to 实操", short="How-to 实操", order=3,
         title="How-to：一篇只讲一件事", nav="How-to 实操",
         desc="修 bug、加功能、控噪音、查没反应、升级不丢配置，每篇给可照抄的请求。",
         home=HOWTO_HOME, items=HOWTO),
    dict(id="wiki", label="术语表", short="术语表", order=4,
         title="术语表：一句话、一个比方、一个误区", nav="术语表",
         desc="来源、触发、线程、评估、授权、工单、订阅、策略、执行器、报告，逐条讲清。",
         home=WIKI_HOME, items=WIKI),
    dict(id="faq", label="常见问题", short="常见问题", order=5,
         title="常见问题", nav="常见问题",
         desc="要钱吗、是官方产品吗、安全吗、为什么 @ 了没反应、升级会不会丢配置。",
         home=FAQ_HOME, items=[]),
    dict(id="reference", label="站点资料", short="站点资料", order=6,
         title="站点资料：全景图、坑、速查", nav="站点资料",
         desc="概念全景图、12 个常见的坑、命令与配置速查、适合谁、关于本站。",
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
        # 栏目首页
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
                item["title"], item["desc"], item["body"],
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

    latest = ["/start/1-what", "/start/2-setup", "/start/3-first-task",
              "/reference/pitfalls", "/howto/recipes", "/wiki/"]

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
