const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const html = read("index.html");
const css = read("css/style.css");
const jsFiles = ["main", "projects", "contact"].map((name) => read(`js/${name}.js`));

test("6영역·시맨틱 요소·한국어 문서와 고유 ID를 갖춘다", () => {
  assert.match(html, /<html lang="ko"/);
  ["header", "nav", "main", "section", "article", "footer"].forEach((tag) => assert.match(html, new RegExp(`<${tag}[ >]`)));
  ["hero", "about", "skills", "projects", "contact", "footer"].forEach((id) => assert.match(html, new RegExp(`id="${id}"`)));
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  [...html.matchAll(/href="#([^"]+)"/g)].forEach((match) => assert.ok(ids.includes(match[1])));
});

test("외부 CSS·defer JS·로컬 자산과 의미 있는 alt를 사용한다", () => {
  assert.match(html, /<link rel="stylesheet" href="css\/style.css">/);
  const scripts = [...html.matchAll(/<script\b([^>]*)>/g)];
  assert.equal(scripts.length, 3);
  scripts.forEach(([, attrs]) => {
    assert.match(attrs, /\bdefer\b/);
    const file = attrs.match(/src="([^"]+)"/)[1];
    assert.ok(fs.existsSync(path.join(root, file)));
    assert.doesNotMatch(file, /^https?:/);
  });
  [...html.matchAll(/<img\b([^>]*)>/g)].forEach(([, attrs]) => assert.match(attrs, /alt="[^"]+"/));
  ["profile", "loom", "deepquest", "tinypilot"].forEach((name) => {
    assert.match(read(`images/${name}.svg`), /<title[^>]*>[^<]+<\/title>/);
  });
});

test("폼 label·오류 연결·필수값·전송 없는 고지를 갖춘다", () => {
  ["name", "email", "message"].forEach((name) => {
    assert.match(html, new RegExp(`<label for="contact-${name}"`));
    assert.match(html, new RegExp(`id="contact-${name}"[^>]*required`));
    assert.match(html, new RegExp(`aria-describedby="${name}-error"`));
  });
  assert.match(html, /메시지는 실제로 전송되지 않습니다/);
  assert.doesNotMatch(jsFiles[2], /\bfetch\s*\(|localStorage\s*\./);
});

test("CSS 변수·테마·Flex/Grid·768/1024·hover·transition·그림자를 사용한다", () => {
  [/:root\s*\{/, /\[data-theme="dark"\]/, /--color-/, /--font-/, /--space-/, /\.site-nav[^}]*display:\s*flex/, /repeat\(auto-fit,\s*minmax\(/, /min-width:\s*768px/, /min-width:\s*1024px/, /:hover/, /transition:/, /box-shadow:/].forEach((pattern) => assert.match(css, pattern));
});

test("금지 라이브러리·인라인 처리·var 없이 필수 DOM/이벤트/ES6를 사용한다", () => {
  const js = jsFiles.join("\n");
  assert.doesNotMatch(html, /\bonclick\s*=|\bstyle\s*=/i);
  assert.doesNotMatch(html, /(?:src|href)="[^"]*(?:react|vue|jquery|bootstrap|tailwind)/i);
  assert.doesNotMatch(js, /\bvar\s+[A-Za-z_$]/);
  ["querySelector", "querySelectorAll", "textContent", "innerHTML", "classList.add", "classList.remove", "classList.toggle", "preventDefault", "async", "await", ".map(", ".forEach("].forEach((name) => assert.ok(js.includes(name), name));
  ["click", "input", "submit", "scroll"].forEach((event) => assert.ok(js.includes(`addEventListener("${event}"`), event));
});
