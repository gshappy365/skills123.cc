# dsh-superagent tutorial snapshot

`site/guides/dsh-superagent/` is a static snapshot of the local
`~/WorkBuddy/dsh-superagent-tutorial` source on 2026-11-14.
The source is not a Git checkout and contained no lockfile or standalone MIT
license file. Its original README, including its MIT licensing statement and
the UI Kit exception, is preserved as `SOURCE-README.md` in the guide root.
The exact source inputs are preserved in `dsh-superagent-source/source/` and
identified by `dsh-superagent-source/source-sha256.txt`. Only manifest entries
are included; dependencies and files outside the manifest are not archived.

The UI Kit's unmodified `xxd/LICENSE` includes PolyForm Noncommercial 1.0.0
and both required notices. The site owner confirmed this deployment is
noncommercial. Reassess the UI Kit license before commercial use or further
distribution; it is not covered by the tutorial's stated MIT license.

To reproduce without the original project, copy `dsh-superagent-source/source/`
to a clean disposable directory, run `shasum -a 256 -c` with the absolute path
to `source-sha256.txt`, apply `subpath.patch` with `patch -p1 -i` and copy the
preserved `package-lock.json` into the copy. With Node 24.15.0,
run `npm ci --ignore-scripts` and then
`SITE_URL=https://skills123.cc BASE_PATH=/guides/dsh-superagent/ npm run build`.
Copy `dist/` to the guide root and retain `SOURCE-README.md`. The patch makes
internal navigation, Markdown links, assets, both search indexes, and canonical
URLs work under the subpath. The page's search index URL contains the first 16
hex digits of the SHA-256 of the exact generated `search-sections.json` bytes;
the hash changes whenever the generated index changes. A clean build was
compared byte-for-byte against the snapshot, excluding the separately preserved
`SOURCE-README.md`. No standalone `sync()` call is introduced after
`X.init(document)`; such a call breaks initialization in the PStack snapshot.
Run `npm test` and `npm run test:e2e` before publishing.
