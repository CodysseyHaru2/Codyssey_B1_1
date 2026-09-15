const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const source = fs.readFileSync(path.join(__dirname, "../js/projects.js"), "utf8");
const settle = () => new Promise((resolve) => setImmediate(resolve));
const reply = (data, status = 200) => ({ ok: status === 200, status, json: async () => data });
const repo = (name, values = {}) => ({ name, html_url: `https://github.com/develsvai/${name}`, stargazers_count: 0, ...values });

const setup = (fetcher) => {
  const element = () => ({ children: [], attrs: {}, classes: new Set(), events: {}, innerHTML: "", setAttribute(name, value) { this.attrs[name] = value; }, replaceChildren() { this.children = []; }, append(child) { this.children.push(child); }, addEventListener(name, callback) { this.events[name] = callback; }, classList: { toggle() {} } });
  const grid = element();
  const status = element();
  const calls = [];
  vm.runInNewContext(source, {
    document: { querySelector: (selector) => selector === "#projects-grid" ? grid : status, createElement: element },
    URL, AbortController, setTimeout, clearTimeout,
    fetch: async (...args) => { calls.push(args); return fetcher(...args); }
  });
  return { grid, status, calls, text: () => status.children[0].textContent, retry: () => status.children[1].events.click() };
};

test("로딩 후 실제 데이터만 렌더하고 대표 이름 순서를 유지한다", async () => {
  let release;
  const app = setup(() => new Promise((resolve) => { release = resolve; }));
  assert.match(app.text(), /불러오는 중/);
  assert.equal(app.grid.attrs["aria-busy"], "true");
  release(reply([repo("Other"), repo("TinyPilot-KVM-Docker"), repo("DeepQuest"), repo("Loom")]));
  await settle();
  assert.equal(app.grid.attrs["aria-busy"], "false");
  const headings = [...app.grid.innerHTML.matchAll(/<h3>(.*?)<\/h3>/g)].map((match) => match[1]);
  assert.deepEqual(headings, ["Loom", "DeepQuest", "TinyPilot-KVM-Docker", "Other"]);
  assert.match(app.grid.innerHTML, /images\/loom.svg/);
  assert.equal(app.calls.length, 1);
});

test("대표 저장소가 없으면 만들지 않고 누락값을 자연스럽게 표시한다", async () => {
  const app = setup(async () => reply([repo("Example", { description: null, language: null, homepage: null, fork: true })]));
  await settle();
  assert.match(app.text(), /Loom·DeepQuest·TinyPilot/);
  assert.doesNotMatch(app.grid.innerHTML, /<h3>Loom/);
  assert.match(app.grid.innerHTML, /언어 정보 없음/);
  assert.match(app.grid.innerHTML, /저장소에서 자세한 내용/);
  assert.match(app.grid.innerHTML, /FORK/);
  assert.doesNotMatch(app.grid.innerHTML, /사이트 보기/);
});

test("빈 목록·HTTP·요청 제한·네트워크·잘못된 응답을 구분한다", async () => {
  for (const [fetcher, expected] of [
    [async () => reply([]), /표시할 프로젝트가 없습니다/],
    [async () => reply([], 500), /네트워크 상태/],
    [async () => reply([], 403), /요청 제한/],
    [async () => reply([], 429), /요청 제한/],
    [async () => { throw Error("offline"); }, /네트워크 상태/],
    [async () => reply({ wrong: true }), /불러올 수 없습니다/]
  ]) {
    const app = setup(fetcher);
    await settle();
    assert.match(app.text(), expected);
    assert.equal(app.grid.innerHTML, "");
    assert.equal(app.grid.attrs["aria-busy"], "false");
  }
});

test("오류 후 재시도 중복 클릭은 한 요청이며 기존 카드를 누적하지 않는다", async () => {
  let count = 0;
  let release;
  const app = setup(() => ++count === 1 ? reply([], 500) : new Promise((resolve) => { release = resolve; }));
  await settle();
  const retry = app.status.children[1].events.click;
  retry(); retry();
  assert.equal(count, 2);
  assert.match(app.text(), /불러오는 중/);
  release(reply([repo("Only"), repo("Only")]));
  await settle();
  assert.equal((app.grid.innerHTML.match(/<article/g) || []).length, 1);
});

test("외부 HTML을 escape하고 위험한 URL·내부 장비 링크를 제거한다", async () => {
  const app = setup(async () => reply([
    repo('Bad<img src=x onerror="attack()">', { description: "<script>bad()</script>&'", language: "<svg>", html_url: "javascript:attack()", homepage: "https://device.tail123.ts.net/" }),
    repo("PrivateIP", { homepage: "http://192.168.0.1/" }),
    repo("Credentials", { homepage: "https://user:secret@example.com/" }),
    repo("Public", { homepage: "https://example.com/?a=1&b=2" })
  ]));
  await settle();
  assert.doesNotMatch(app.grid.innerHTML, /<script>|onerror="|href="javascript:|192\.168|tail123|secret/);
  assert.match(app.grid.innerHTML, /&lt;script&gt;/);
  assert.match(app.grid.innerHTML, /href="https:\/\/example.com\/\?a=1&amp;b=2"/);
  assert.match(app.grid.innerHTML, /rel="noopener noreferrer"/);
});

test("100개를 넘는 목록은 다음 페이지를 요청하고 중복·비공개 객체는 제외한다", async () => {
  const first = Array.from({ length: 100 }, (_, index) => repo(`Repo${index}`));
  const app = setup(async (url) => reply(new URL(url).searchParams.get("page") === "1" ? first : [repo("Tail"), repo("Repo0"), repo("Secret", { private: true }), null]));
  await settle();
  assert.equal(app.calls.length, 2);
  assert.match(app.calls[1][0], /page=2/);
  assert.match(app.text(), /101개/);
  assert.doesNotMatch(app.grid.innerHTML, /<h3>Secret/);
});
