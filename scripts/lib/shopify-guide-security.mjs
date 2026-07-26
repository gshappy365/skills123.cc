import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import path from "node:path";
import { realpath } from "node:fs/promises";

const ARCHIVE_HOST = "shopify.baoea.com";
const ALLOWED_CATEGORIES = new Set(["basic", "advanced", "liquid", "tools"]);
const MAX_MEDIA_BYTES = 8 * 1024 * 1024;

export async function resolveSnapshotMarkdown({ snapshotRoot, file, url }) {
  if (
    typeof file !== "string" ||
    path.isAbsolute(file) ||
    file.includes("\\") ||
    !file.startsWith("pages/") ||
    path.extname(file) !== ".md"
  ) {
    throw new Error(`Unsafe snapshot file: ${file}`);
  }

  const sourceUrl = new URL(url);
  if (sourceUrl.protocol !== "https:" || sourceUrl.hostname !== ARCHIVE_HOST) {
    throw new Error(`Unexpected snapshot URL: ${url}`);
  }
  const segments = sourceUrl.pathname.split("/").filter(Boolean);
  const [category, ...slugParts] = segments;
  if (!ALLOWED_CATEGORIES.has(category)) {
    throw new Error(`Unexpected snapshot category: ${category}`);
  }
  const expectedFile = `pages/${category}/${
    slugParts.length ? `${slugParts.join("/")}.md` : "index.md"
  }`;
  if (file !== expectedFile) {
    throw new Error(`Snapshot URL/file mismatch: ${url} -> ${file}`);
  }

  const pagesRoot = path.resolve(snapshotRoot, "pages");
  const candidate = path.resolve(snapshotRoot, file);
  const lexicalRelative = path.relative(pagesRoot, candidate);
  if (
    !lexicalRelative ||
    lexicalRelative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(lexicalRelative)
  ) {
    throw new Error(`Snapshot file escapes pages/: ${file}`);
  }

  const [realPagesRoot, realCandidate] = await Promise.all([
    realpath(pagesRoot),
    realpath(candidate),
  ]);
  const realRelative = path.relative(realPagesRoot, realCandidate);
  if (
    !realRelative ||
    realRelative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(realRelative)
  ) {
    throw new Error(`Snapshot symlink escapes pages/: ${file}`);
  }
  return realCandidate;
}

export function assertSafeMediaSource(href) {
  const url = new URL(href);
  if (url.protocol !== "https:" || url.hostname !== ARCHIVE_HOST) {
    throw new Error(`Untrusted media source: ${href}`);
  }
  return url;
}

export function resolveMediaDownloadUrl(href) {
  const source = assertSafeMediaSource(href);
  if (source.pathname !== "/_next/image") return source.href;
  const original = source.searchParams.get("url");
  if (!original || !original.startsWith("/") || original.startsWith("//")) {
    throw new Error(`Unsafe optimized media path: ${href}`);
  }
  const resolved = new URL(original, source.origin);
  assertSafeMediaSource(resolved.href);
  return resolved.href;
}

function isPrivateIpv4(address) {
  const [a, b] = address.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 192 && b === 2) ||
    (a === 198 && (b === 18 || b === 19 || b === 51)) ||
    (a === 203 && b === 0) ||
    a >= 224
  );
}

export function isPrivateOrReservedAddress(address) {
  const family = isIP(address);
  if (family === 4) return isPrivateIpv4(address);
  if (family !== 6) return true;
  const normalized = address.toLocaleLowerCase();
  if (normalized.startsWith("::ffff:")) {
    return isPrivateIpv4(normalized.slice("::ffff:".length));
  }
  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb")
  );
}

export async function assertPublicMediaHost(hostname, lookupFn = lookup) {
  const addresses = await lookupFn(hostname, { all: true, verbatim: true });
  if (
    !addresses.length ||
    addresses.some(({ address }) => isPrivateOrReservedAddress(address))
  ) {
    throw new Error(`Media host resolved to a private or reserved address: ${hostname}`);
  }
}

export function detectImageType(bytes) {
  if (
    bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    )
  ) {
    return { extension: ".png", mime: "image/png" };
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { extension: ".jpg", mime: "image/jpeg" };
  }
  const head = bytes.subarray(0, 12).toString("ascii");
  if (head.startsWith("GIF87a") || head.startsWith("GIF89a")) {
    return { extension: ".gif", mime: "image/gif" };
  }
  if (head.startsWith("RIFF") && head.slice(8, 12) === "WEBP") {
    return { extension: ".webp", mime: "image/webp" };
  }
  if (
    bytes.length >= 12 &&
    bytes.subarray(4, 12).toString("ascii").match(/^ftyp(?:avif|avis)/)
  ) {
    return { extension: ".avif", mime: "image/avif" };
  }
  throw new Error("Unsupported or invalid image signature");
}

export async function readBoundedImageResponse(
  response,
  { maxBytes = MAX_MEDIA_BYTES } = {}
) {
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const contentType = (response.headers.get("content-type") ?? "")
    .split(";", 1)[0]
    .trim()
    .toLocaleLowerCase();
  if (contentType && !/^image\/(?:png|jpeg|gif|webp|avif)$/.test(contentType)) {
    throw new Error(`Unsupported media type: ${contentType}`);
  }
  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (declaredLength > maxBytes) {
    throw new Error(`Media exceeds ${maxBytes} bytes`);
  }

  const chunks = [];
  let total = 0;
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Media response has no body");
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error(`Media exceeds ${maxBytes} bytes`);
    }
    chunks.push(Buffer.from(value));
  }
  const bytes = Buffer.concat(chunks, total);
  const detected = detectImageType(bytes);
  if (contentType && detected.mime !== contentType) {
    throw new Error(`Media signature does not match ${contentType}`);
  }
  return { bytes, ...detected };
}
