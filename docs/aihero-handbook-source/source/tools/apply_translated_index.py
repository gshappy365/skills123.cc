# -*- coding: utf-8 -*-
"""翻译完成后，把 content/pages 的中文 title/description/正文同步进 site-index.json。

用法：python3 tools/apply_translated_index.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = ROOT / "content" / "pages"
TAG_RE = re.compile(r"<[^>]+>")
MD_RE = re.compile(r"[`*_>#\-|]")


def plain(text: str) -> str:
    s = TAG_RE.sub(" ", text)
    s = MD_RE.sub(" ", s)
    return re.sub(r"\s+", " ", s).strip()


def front(text: str):
    m = re.match(r"^---\n(.*?)\n---\n\n?(.*)$", text, re.S)
    if not m:
        return {}, ""
    fm = {}
    for line in m.group(1).splitlines():
        mm = re.match(r"^(title|description): (.*)$", line)
        if mm:
            v = mm.group(2).strip()
            q = re.match(r'^"([\s\S]*)"$', v)
            fm[mm.group(1)] = q.group(1) if q else v
    return fm, m.group(2)


def main() -> None:
    idx_path = ROOT / "content" / "site-index.json"
    index = json.loads(idx_path.read_text(encoding="utf-8"))
    by_href = {p["href"]: p for p in index["pages"]}
    updated = 0

    for f in PAGES.glob("**/index.md"):
        rel = f.relative_to(PAGES).with_suffix("")
        parts = rel.parts  # e.g. ('articles', 'what-is-an-llm', 'index')
        if len(parts) == 2 and parts[1] == "index":
            href = f"/{parts[0]}"
        elif len(parts) == 3 and parts[2] == "index":
            href = f"/{parts[0]}/{parts[1]}"
        else:
            continue
        page = by_href.get(href)
        if not page:
            continue
        fm, body = front(f.read_text(encoding="utf-8"))
        changed = False
        if fm.get("title") and fm["title"] != page["title"]:
            page["title"] = page["nav_title"] = fm["title"]
            changed = True
        if fm.get("description") and fm["description"] != page["description"]:
            page["description"] = page["excerpt"] = fm["description"]
            changed = True
        st = plain(body)[:700]
        if st and st != page.get("search_text"):
            page["search_text"] = st
            changed = True
        if changed:
            updated += 1

    idx_path.write_text(json.dumps(index, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"site-index.json 已同步：{updated} 页更新（共 {len(index['pages'])} 页）")


if __name__ == "__main__":
    main()
