# Shopify handbook snapshot

`site/guides/shopify-handbook/` is a static build of the Shopify 中文教程 collection.
The source is maintained separately as an Astro project themed with the XXD UI Kit.
This repository publishes the generated snapshot and does not rebuild it during
deployment, the same arrangement used for `docs/pstack-guide.md`.

## Build

From the separately maintained source project:

```bash
SITE_URL=https://skills123.cc npm run build:deploy
```

`build:deploy` runs the static build, generates `search-sections.json`, then prefixes
every in-site absolute path with `/guides/shopify-handbook/`. Replace this directory
with the resulting `dist/`, keeping `assets/`, `xxd/`, `site.css`, `site-shopify.css`,
`search-sections.json`, `favicon.svg` and `404.html`.

## Content

- 202 article pages in five sections: basic 39, advanced 94, liquid 42, tools 3, plus
  24 topic and reference pages (专题与站点资料).
- The guide landing page is `index.html` at this directory; `404.html` serves as the
  guide's not-found page.
- Images live under `assets/` and are referenced by the snapshot itself, so no upstream
  host is contacted at runtime.
- Upstream hostnames, affiliate redirects and the original author's personal contact
  details are stripped while the snapshot is generated.

## Licensing

The XXD UI Kit under `xxd/` carries its own PolyForm Noncommercial license and required
notices at `xxd/LICENSE`; it is not covered by any content license. The site owner has
confirmed this deployment is noncommercial. Reassess the XXD license before any
commercial use or redistribution.

## Verification

`npm test` covers page and section counts, in-site link resolution, image locality,
absence of upstream hosts and affiliate links, and the guide's presence in the global
catalogue and search.
