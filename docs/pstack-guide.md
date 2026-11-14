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
build command above, and copy the source `LICENSE` into the guide root. A clean
rebuild matched the published snapshot apart from that additional license file.
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
