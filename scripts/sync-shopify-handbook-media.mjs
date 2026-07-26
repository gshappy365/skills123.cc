import { createHash } from "node:crypto";
import { access, mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertPublicMediaHost,
  assertSafeMediaSource,
  detectImageType,
  readBoundedImageResponse,
  resolveMediaDownloadUrl,
  resolveSnapshotMarkdown,
} from "./lib/shopify-guide-security.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const snapshotRoot = path.join(root, "content/guides/shopify-handbook");
const outputRoot = path.join(root, "site/assets/images/shopify-handbook");
const manifestPath = path.join(snapshotRoot, "media-manifest.json");
const failuresPath = path.join(snapshotRoot, "media-failures.json");
const blockedHosts = new Set(["a.impactradius-go.com", "shopify.pxf.io"]);

function sourceKey(href) {
  return assertSafeMediaSource(href).href;
}

const snapshot = JSON.parse(
  await readFile(path.join(snapshotRoot, "snapshot-source.json"), "utf8")
);
const candidates = new Map();
for (const page of snapshot.pages) {
  const pathname = new URL(page.url).pathname.replace(/^\/|\/$/g, "");
  if (!/^(basic|advanced|liquid|tools)(\/|$)/.test(pathname)) continue;
  const sourceFile = await resolveSnapshotMarkdown({
    snapshotRoot,
    file: page.file,
    url: page.url,
  });
  const markdown = await readFile(sourceFile, "utf8");
  for (const match of markdown.matchAll(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g)) {
    const [, alt, href] = match;
    const url = new URL(href);
    if (blockedHosts.has(url.hostname) || /二维码|联系|折扣|优惠|领取/i.test(alt)) continue;
    const key = sourceKey(href);
    candidates.set(key, {
      source_url: key,
      alt,
      download_url: resolveMediaDownloadUrl(href),
    });
  }
}

await mkdir(outputRoot, { recursive: true });
await assertPublicMediaHost("shopify.baoea.com");
const existingManifest = JSON.parse(
  await readFile(manifestPath, "utf8").catch(() => "[]")
);
const existingBySource = new Map(existingManifest.map((item) => [item.source_url, item]));
const approvedOmissions = JSON.parse(
  await readFile(path.join(snapshotRoot, "media-omissions.json"), "utf8").catch(() => "[]")
);
const omissionBySource = new Map(approvedOmissions.map((item) => [item.source_url, item]));
const manifest = [];
let failures = 0;
const failedMedia = [];
const queue = [...candidates.values()].filter(
  (item) => !omissionBySource.has(item.source_url)
);
let cursor = 0;

async function fetchImage(url) {
  assertSafeMediaSource(url);
  const response = await fetch(url, {
    headers: { "user-agent": "Skills123 static archive/1.0" },
    redirect: "error",
    signal: AbortSignal.timeout(45_000),
  });
  return readBoundedImageResponse(response);
}

async function validatedLocalMedia(item, localPath) {
  const expectedPrefix = createHash("sha256")
    .update(item.source_url)
    .digest("hex")
    .slice(0, 16);
  if (
    !new RegExp(
      `^/assets/images/shopify-handbook/${expectedPrefix}\\.(?:png|jpg|gif|webp|avif)$`
    ).test(localPath)
  ) {
    throw new Error(`Unsafe existing media path: ${localPath}`);
  }
  const existingFile = path.join(root, "site", localPath.replace(/^\//, ""));
  await access(existingFile);
  const metadata = await stat(existingFile);
  if (metadata.size > 8 * 1024 * 1024) {
    throw new Error(`Existing media exceeds 8 MiB: ${localPath}`);
  }
  const existingBytes = await readFile(existingFile);
  const detected = detectImageType(existingBytes);
  if (path.extname(existingFile) !== detected.extension) {
    throw new Error(`Existing media extension mismatch: ${localPath}`);
  }
  return { bytes: metadata.size, localPath };
}

async function writeJsonAtomic(targetPath, value) {
  const temporaryPath = `${targetPath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`);
  await rename(temporaryPath, targetPath);
}

async function syncNext() {
  const item = queue[cursor++];
  if (!item) return;
  try {
    const existing = existingBySource.get(item.source_url);
    if (existing?.snapshot_generated_at === snapshot.generated_at) {
      assertSafeMediaSource(existing.source_url);
      await validatedLocalMedia(item, existing.local_path);
      manifest.push(existing);
      return syncNext();
    }
    const expectedPrefix = createHash("sha256")
      .update(item.source_url)
      .digest("hex")
      .slice(0, 16);
    for (const extension of [".png", ".jpg", ".gif", ".webp", ".avif"]) {
      const localPath = `/assets/images/shopify-handbook/${expectedPrefix}${extension}`;
      try {
        const local = await validatedLocalMedia(item, localPath);
        manifest.push({
          source_url: item.source_url,
          download_url: item.download_url,
          local_path: local.localPath,
          alt: item.alt,
          bytes: local.bytes,
          snapshot_generated_at: snapshot.generated_at,
        });
        return syncNext();
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }
    let downloaded;
    try {
      downloaded = await fetchImage(item.download_url);
    } catch (error) {
      if (item.download_url === item.source_url) throw error;
      downloaded = await fetchImage(item.source_url);
    }
    const { bytes, extension } = downloaded;
    const ext = extension;
    const fileName = `${createHash("sha256").update(item.source_url).digest("hex").slice(0, 16)}${ext}`;
    await writeFile(path.join(outputRoot, fileName), bytes);
    manifest.push({
      source_url: item.source_url,
      download_url: item.download_url,
      local_path: `/assets/images/shopify-handbook/${fileName}`,
      alt: item.alt,
      bytes: bytes.length,
      snapshot_generated_at: snapshot.generated_at,
    });
    process.stdout.write(".");
  } catch (error) {
    failures += 1;
    failedMedia.push({
      source_url: item.source_url,
      download_url: item.download_url,
      reason: error.message,
    });
    console.error(`\nFailed ${item.download_url}: ${error.message}`);
  }
  await syncNext();
}

await Promise.all(Array.from({ length: Math.min(8, queue.length) }, () => syncNext()));
manifest.sort((a, b) => a.source_url.localeCompare(b.source_url));
const staleOmissions = approvedOmissions.filter(
  (item) => !candidates.has(item.source_url)
);
if (staleOmissions.length) {
  throw new Error(
    `Approved media omissions are stale: ${staleOmissions
      .map((item) => item.source_url)
      .join(", ")}`
  );
}
await writeJsonAtomic(failuresPath, failedMedia);
if (!failures) {
  await writeJsonAtomic(manifestPath, manifest);
}
console.log(
  `\nLocalized ${manifest.length}/${candidates.size} media files; ${approvedOmissions.length} approved omissions; ${failures} failed.`
);
if (failures) process.exitCode = 1;
