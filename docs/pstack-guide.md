# PStack tutorial snapshot

`site/guides/pstack/` is a static build of the tutorial from
the local clone of [nevertoday/xxd-pstack](https://github.com/nevertoday/xxd-pstack)
at commit `535cc373fd9e7e45622d4502b2efa4c4f04822dd`, generated with
`SITE_URL=https://skills123.cc BASE_PATH=/guides/pstack/ npm run build`.
The source is maintained separately; this repository publishes the generated
snapshot and does not rebuild it during deployment. The source tree matches that
commit except for its regenerated lockfile, preserved at
`docs/pstack-source/package-lock.json` (SHA-256
`0df50fe6e0dc25faa2ea5a43873b659b5d5caee715534e259aa9fd6a60cfb69a`).
The verified build used Node.js 24.15.0 and `npm ci`. To reproduce it, check out
the commit, replace its lockfile with the preserved copy, run `npm ci` and the
build command above, and copy the source `LICENSE` into the guide root. Remove
the standalone `sync();` call after `X.init(document)` from the generated HTML:
it references an undefined function and prevents search and mobile navigation
from initializing. A clean rebuild otherwise matches the published snapshot.
To refresh it, build the desired source revision, replace only this guide's
generated output, update the preserved lockfile, and retain both licenses. Run
`npm test` and check the generated changes before publishing.

The tutorial's MIT license is at `/guides/pstack/LICENSE`. The XXD UI Kit
under `xxd/` has its own PolyForm Noncommercial license and required notices at
`/guides/pstack/xxd/LICENSE`; it is not covered by the tutorial's MIT license.
The site owner has confirmed this deployment is noncommercial. Reassess the
XXD license before any commercial use or redistribution.

The tutorial is a separate upstream snapshot from the Cursor plugin snapshot
in the PStack package, so their skill lists and versions can differ.

## Host navigation

Every page carries a top-bar link back to the host site:
`<a class="site-up" href="/" aria-label="返回Skills123">← Skills123</a>`, inserted as the
first child of `.site-tools`. Styling lives in `site.css` and mirrors the REA and
teamai-cli guides: an 11px pill at desktop widths, and an arrow-only square below
560px because the tool row is only 204px wide in the third grid column. The link is the
single intentional escape from the guide prefix, so `tests/pstack-guide.test.mjs` allows exactly
`href="/"` in its link check. This markup is added after the upstream build, so a
refreshed snapshot must re-insert it and bump the `site.css?v=` hash in every page.
