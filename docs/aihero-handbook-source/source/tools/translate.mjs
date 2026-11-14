// 批量翻译 content/pages/**：调用云服务免密钥 LLM，把英文正文翻成简体中文。
// 断点续跑：已翻译（frontmatter 带 translated: zh）的文件自动跳过。
// 用法：node tools/translate.mjs [--limit=N] [--model=glm-5.3-flash] [--conc=N]
import { createWorkBuddyCloud } from "@tencent-ai/workbuddy-cloud-sdk";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// publicConfig（应用公开配置，可放源码；勿写入日志）
const cloud = createWorkBuddyCloud({
  endpoint: "https://wbapp-epu4itmr5ogaefx0dtnwo6.app.workbuddy.host",
  publishableKey: "wbpk_ePu4iTMR5oGAEFx0DtnWo6_tCEO9cnjV6qJ6MfM5zLyE37TKJKznkg3",
});

const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const m = a.match(/^--([\w-]+)(?:=(.*))?$/);
  return m ? [m[1], m[2] ?? true] : [];
}));
const MODEL = args.model || "glm-5.3-flash";
const CONC = Number(args.conc || 4);
const LIMIT = Number(args.limit || Infinity);
const CHUNK = 9000;      // 超过则按段落切块
const PAGES = join(process.cwd(), "content", "pages");

const SYSTEM = `你是专业的技术文档翻译，把英文 AI 编程技术内容翻译成简体中文。规则：
1. 只输出译文，不要任何解释、前言或总结。
2. 完整保留 Markdown 结构：标题层级、列表、表格、引用、分隔线的数量与顺序不得改变。
3. 以下内容保持原样，一个字符都不改：行内代码与代码块、链接 URL 与锚点、图片语法、HTML 标签。
4. 链接方括号里的文字翻译成中文，URL 部分原样保留。
5. 专有名词（工具名、命令名、参数名、库名，如 Claude Code、AGENTS.md、temperature）保留英文；通用概念性术语首次出现时在括号里给出英文原词。
6. 语气自然流畅，像人写的中文技术文章，不要翻译腔。`;

function listMarkdown(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) listMarkdown(p, acc);
    else if (name.endsWith(".md")) acc.push(p);
  }
  return acc;
}

function cjkRatio(s) {
  const cjk = (s.match(/[\u4e00-\u9fff]/g) || []).length;
  const letters = (s.match(/[a-zA-Z]/g) || []).length;
  return letters === 0 ? 1 : cjk / (cjk + letters);
}

function parseFront(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n\n?/);
  if (!m) return { fm: null, body: text };
  return { fm: m[1], body: text.slice(m[0].length) };
}

function translateFmValue(v) {
  return v.replace(/^"([\s\S]*)"$/, "$1"); // 由调用方翻译，这里只去引号占位
}

async function llmTranslate(text, isLast) {
  const messages = [
    { role: "system", content: SYSTEM },
    { role: "user", content: `把下面的 Markdown 内容翻译成简体中文${isLast ? "" : "（这是长文的一个片段，直接翻译该片段即可，不要补写结尾）"}：\n\n${text}` },
  ];
  let out = "";
  for await (const chunk of cloud.llm.chat.completions.create({
    model: MODEL,
    messages,
    stream: true,
    temperature: 0.2,
  })) {
    const delta = chunk.choices?.[0]?.delta?.content;
    if (delta) out += delta;
  }
  return out.trim();
}

/** 把内容按代码围栏切成 text/code 段：只把 text 段送翻译，code 段原样保留（也避开 WAF 对代码内容的拦截）。 */
async function translateSegments(text, isLast) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  const out = [];
  let codeIndex = 0;
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith("```")) {
      out.push(part);
      codeIndex++;
      continue;
    }
    const trimmed = part.trim();
    if (!trimmed) {
      out.push(part);
      continue;
    }
    const zh = await llmTranslate(part, isLast && codeIndex === 0);
    out.push(zh + "\n\n");
  }
  return out.join("").replace(/\n{3,}/g, "\n\n").trim();
}

function chunkBody(body) {
  if (body.length <= CHUNK) return [body];
  const parts = [];
  let cur = "";
  for (const block of body.split(/\n(?=#{1,4} )/)) {
    if ((cur + "\n\n" + block).length > CHUNK && cur) {
      parts.push(cur);
      cur = block;
    } else {
      cur = cur ? cur + "\n\n" + block : block;
    }
  }
  if (cur) parts.push(cur);
  return parts;
}

async function translateFile(file) {
  const raw = readFileSync(file, "utf8");
  const rel = relative(PAGES, file);
  if (/^translated: zh$/m.test(raw)) return { rel, status: "skip" };
  if (cjkRatio(raw) > 0.25) return { rel, status: "skip-zh" };

  const { fm, body } = parseFront(raw);
  const chunks = chunkBody(body);
  const translated = [];
  for (let i = 0; i < chunks.length; i++) {
    translated.push(await translateSegments(chunks[i], i === chunks.length - 1));
  }
  let out = "";
  // frontmatter：title/description 单独翻译
  let fmOut = fm;
  if (fm) {
    const lines = [];
    for (const line of fm.split("\n")) {
      const m = line.match(/^(title|description): (.*)$/);
      if (m) {
        const zh = await llmTranslate(m[2].replace(/^"|"$/g, ""), true);
        lines.push(`${m[1]}: ${JSON.stringify(zh)}`);
      } else if (/^(source|url|fetched|chars):/.test(line)) {
        lines.push(line);
      } else {
        lines.push(line);
      }
    }
    fmOut = lines.join("\n");
    out = `---\n${fmOut}\ntranslated: zh\n---\n\n`;
  }
  out += translated.join("\n\n") + "\n";
  writeFileSync(file, out, "utf8");
  return { rel, status: "ok", chunks: chunks.length, chars: body.length };
}

async function main() {
  const files = listMarkdown(PAGES).sort();
  const t0 = Date.now();
  let done = 0, skipped = 0, failed = 0, idx = 0;
  const queue = [...files];

  async function worker(id) {
    while (queue.length) {
      const file = queue.shift();
      if (idx >= LIMIT) { break; }
      idx++;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const r = await translateFile(file);
          if (r.status === "ok") done++; else skipped++;
          console.log(`[${new Date().toISOString()}] w${id} ${r.status} ${r.rel}${r.status === "ok" ? ` (${r.chunks} 段, ${r.chars} 字符)` : ""}`);
          break;
        } catch (e) {
          if (attempt === 3) {
            failed++;
            console.log(`[${new Date().toISOString()}] w${id} FAIL ${relative(PAGES, file)}: ${String(e.message || e).slice(0, 200)}`);
          } else {
            await new Promise((r) => setTimeout(r, 3000 * attempt));
          }
        }
      }
    }
  }

  await Promise.all(Array.from({ length: CONC }, (_, i) => worker(i + 1)));
  console.log(`\n完成：翻译 ${done}，跳过 ${skipped}，失败 ${failed}，用时 ${Math.round((Date.now() - t0) / 1000)}s`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => { console.error("FATAL", e); process.exit(1); });
