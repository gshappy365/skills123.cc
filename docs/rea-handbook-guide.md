# REA tutorial snapshot

`site/guides/rea-handbook/` is a static snapshot of the local
`~/WorkBuddy/rea-tutorial` project on 2026-11-14, published at
<https://skills123.cc/guides/rea-handbook/>. The source is not a Git checkout.
Its README is preserved as `SOURCE-README.md` in the guide root, together with
the build and licensing notes for this subpath deployment.

The exact source inputs are preserved in `rea-handbook-source/source/` and
identified by `rea-handbook-source/source-sha256.txt`; only manifest entries are
archived, dependencies and build output are not. A lockfile generated from the
same tree is preserved as `rea-handbook-source/package-lock.json`; its
`resolved` URLs point at the npm mirror recorded in the project `.npmrc`, so a
rebuild elsewhere may pass `--registry=https://registry.npmjs.org`.

The tutorial text is original. The UI Kit in `xxd/` is not: its unmodified
`xxd/LICENSE` carries PolyForm Noncommercial 1.0.0 and both required notices
(copyright attribution, and that commercial use needs a separate license). The
site owner confirmed this deployment is noncommercial; reassess before any
commercial use or further redistribution, since the UI Kit license is not
covered by the tutorial text.

To reproduce without the original project, copy `rea-handbook-source/source/`
to a clean disposable directory, verify it with `shasum -a 256 -c` and the
absolute path to `source-sha256.txt`, then copy the preserved
`package-lock.json` into the copy. With Node 22.22.2 run
`npm ci --ignore-scripts` and:

```bash
SITE_BASE=/guides/rea-handbook \
SITE_URL=https://skills123.cc \
SITE_TITLE_SUFFIX=" · Skills123" \
SITE_HOME=/ SITE_HOME_LABEL=Skills123 \
npm run build
npm run check
```

No patch is needed: subpath support is built into the source. `SITE_BASE` moves
internal navigation, Markdown links, styles, scripts, both search indexes and
canonical URLs under the prefix; `SITE_HOME` adds the return link to
skills123.cc; `SITE_TITLE_SUFFIX` appends the host site name to `<title>`.
Copy `dist/` into the guide root and keep `SOURCE-README.md`.

`scripts/search-sections.mjs` stamps every page's `data-sections` URL with the
first 16 hex digits of the SHA-256 of the exact generated
`search-sections.json` bytes, so the index cache-busts whenever it changes.
`scripts/verify.mjs` reports page count, dead internal links and missing assets
under the same prefix. No standalone `sync()` call is introduced after
`X.init(document)`, which is what broke the PStack snapshot's mobile menu.

Run `npm test` and `npm run test:e2e` before publishing.
