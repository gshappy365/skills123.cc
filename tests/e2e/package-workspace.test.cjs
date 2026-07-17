const assert = require("node:assert/strict");
const { readFile } = require("node:fs/promises");
const { createServer } = require("node:http");
const path = require("node:path");
const { after, before, test } = require("node:test");

const playwrightModule = process.env.PLAYWRIGHT_MODULE || "playwright";
const { chromium } = require(playwrightModule);

const siteRoot = path.resolve(__dirname, "../../site");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
};

let browser;
let server;
let baseUrl;

before(async () => {
  server = createServer(async (request, response) => {
    try {
      const requestPath = decodeURIComponent(new URL(request.url, "http://local").pathname);
      const relativePath = requestPath.endsWith("/")
        ? `${requestPath}index.html`
        : requestPath;
      const filePath = path.resolve(siteRoot, `.${relativePath}`);
      if (!filePath.startsWith(`${siteRoot}${path.sep}`)) {
        response.writeHead(403).end("Forbidden");
        return;
      }
      const body = await readFile(filePath);
      response.writeHead(200, {
        "content-type": contentTypes[path.extname(filePath)] || "application/octet-stream",
      });
      response.end(body);
    } catch {
      response.writeHead(404).end("Not found");
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true });
});

after(async () => {
  await browser?.close();
  await new Promise((resolve) => server?.close(resolve));
});

test("development package supports desktop browsing, filtering and search", async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${baseUrl}/packages/development/`, { waitUntil: "networkidle" });

  assert.equal(await page.locator(".skill-row").count(), 42);
  assert.match(await page.locator(".skill-row.is-selected").innerText(), /ask-matt/);
  assert.equal(await page.locator(".workspace-detail h2").innerText(), "ask-matt");
  assert.deepEqual(await page.locator("#group-filters button").allTextContents(), [
    "软件工程",
    "进行中",
    "效率方法",
    "个人知识",
    "工具配置",
    "已弃用",
  ]);

  await page.getByRole("button", { name: "软件工程", exact: true }).click();
  assert.equal(await page.locator(".skill-row").count(), 19);

  await page.getByPlaceholder("例如 implement").fill("prototype");
  assert.equal(await page.locator(".skill-row").count(), 1);
  assert.match(await page.locator(".skill-row.is-selected").innerText(), /prototype/);
  assert.equal(await page.locator(".workspace-detail h2").innerText(), "prototype");

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  assert.equal(horizontalOverflow, false);
  await page.close();
});

test("grouped navigation searches owned skills and restores search on back", async () => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 850 } });
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });

  assert.deepEqual(await page.locator(".package-index-group h2").allTextContents(), [
    "开发",
    "研究",
    "运营",
    "内容",
  ]);
  assert.equal(await page.locator(".package-index-group.is-coming-soon").count(), 2);
  assert.equal(
    await page.locator(".package-index-group.is-coming-soon a").count(),
    0
  );

  await page.getByPlaceholder("搜索技能包、技能或 /command").fill("prototype");
  assert.equal(await page.locator(".catalogue-result.skill-result").count(), 1);
  assert.match(
    await page.locator(".catalogue-result.skill-result").innerText(),
    /归属 · 开发技能包/
  );
  await page.locator(".catalogue-result.skill-result").click();

  assert.equal(new URL(page.url()).searchParams.get("skill"), "prototype");
  assert.equal(await page.locator(".workspace-detail h2").innerText(), "prototype");

  await page.goBack({ waitUntil: "networkidle" });
  assert.equal(new URL(page.url()).searchParams.get("q"), "prototype");
  assert.equal(
    await page.getByPlaceholder("搜索技能包、技能或 /command").inputValue(),
    "prototype"
  );
  assert.equal(await page.locator(".catalogue-result.skill-result").count(), 1);

  await page.getByPlaceholder("搜索技能包、技能或 /command").fill("serenity");
  assert.match(
    await page.locator(".catalogue-result.skill-result").innerText(),
    /归属 · 投研与行业研究技能包/
  );
  await page.locator(".catalogue-result.skill-result").click();
  assert.equal(new URL(page.url()).searchParams.get("skill"), "serenity-skill");
  assert.equal(
    await page.locator("#serenity-skill").evaluate((node) => node.classList.contains("is-selected")),
    true
  );
  assert.equal(await page.locator("#search-position").innerText(), "已从全局搜索定位");
  await page.close();
});

test("workspace direct URL and browser history resolve the same selected skill", async () => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 850 } });
  await page.goto(`${baseUrl}/packages/development/?skill=prototype`, {
    waitUntil: "networkidle",
  });

  assert.equal(await page.locator(".workspace-detail h2").innerText(), "prototype");
  await page.locator('[data-skill-id="ask-matt"]').click();
  assert.equal(new URL(page.url()).searchParams.get("skill"), "ask-matt");
  assert.equal(await page.locator(".workspace-detail h2").innerText(), "ask-matt");

  await page.goBack();
  assert.equal(new URL(page.url()).searchParams.get("skill"), "prototype");
  assert.equal(await page.locator(".workspace-detail h2").innerText(), "prototype");
  await page.close();
});

test("mobile detail drawer closes without losing workspace selection", async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${baseUrl}/packages/development/`, { waitUntil: "networkidle" });

  await page.locator('[data-skill-id="implement"]').click();
  await page.waitForTimeout(220);
  assert.equal(await page.locator(".workspace-detail").evaluate((node) => node.classList.contains("is-open")), true);
  assert.equal(await page.locator(".workspace-detail h2").innerText(), "implement");
  const directoryPosition = await page.evaluate(() => window.scrollY);

  await page.locator("#detail-close").click();
  await page.waitForTimeout(220);
  assert.equal(await page.locator(".workspace-detail").evaluate((node) => node.classList.contains("is-open")), false);
  assert.match(await page.locator(".skill-row.is-selected").innerText(), /implement/);
  assert.equal(await page.evaluate(() => window.scrollY), directoryPosition);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    ),
    false
  );
  await page.close();
});
