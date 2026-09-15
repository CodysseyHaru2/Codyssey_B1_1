const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const source = fs.readFileSync(path.join(__dirname, "../js/main.js"), "utf8");

class Element {
  constructor(attributes = {}) {
    this.attributes = { ...attributes };
    this.events = {};
    this.classes = new Set();
    this.hidden = false;
    this.classList = {
      add: (name) => this.classes.add(name),
      remove: (name) => this.classes.delete(name),
      contains: (name) => this.classes.has(name),
      toggle: (name, force) => {
        const active = force ?? !this.classes.has(name);
        if (active) this.classes.add(name); else this.classes.delete(name);
        return active;
      }
    };
  }
  setAttribute(name, value) { this.attributes[name] = value; }
  getAttribute(name) { return this.attributes[name]; }
  addEventListener(name, callback) { (this.events[name] ??= []).push(callback); }
  emit(name, event = {}) { this.events[name]?.forEach((callback) => callback(event)); }
  focus() { this.focused = true; }
  scrollIntoView(options) { this.scrollOptions = options; }
}

const setup = ({ storage = new Map(), blockedStorage = false, reduced = false, observer = true } = {}) => {
  const ids = Object.fromEntries(["site-header", "site-nav", "menu-toggle", "theme-toggle", "back-to-top", "about"].map((id) => [id, new Element()]));
  const brand = new Element({ href: "#about" });
  const link = new Element({ href: "#about" });
  const root = new Element();
  const reveals = [new Element(), new Element()];
  const document = new Element();
  document.documentElement = root;
  document.querySelector = (selector) => selector === ".brand" ? brand : ids[selector.slice(1)];
  document.querySelectorAll = (selector) => selector === ".reveal" ? reveals : [link];
  const media = (matches) => ({ matches, events: {}, addEventListener(name, callback) { this.events[name] = callback; }, emit(next) { this.matches = next; this.events.change?.(); } });
  const reduce = media(reduced);
  const desktop = media(false);
  const window = new Element();
  window.scrollY = 0;
  window.matchMedia = (query) => query.includes("reduced-motion") ? reduce : desktop;
  window.history = { replaceState: (_state, _title, hash) => { window.hash = hash; } };
  window.requestAnimationFrame = (callback) => callback();
  window.scrollTo = (options) => { window.scrollOptions = options; window.scrollY = options.top; window.emit("scroll"); };
  window.localStorage = {
    getItem: (key) => { if (blockedStorage) throw Error("blocked"); return storage.get(key); },
    setItem: (key, value) => { if (blockedStorage) throw Error("blocked"); storage.set(key, value); }
  };
  if (observer) {
    window.IntersectionObserver = class {
      constructor(callback, options) { this.callback = callback; this.options = options; this.targets = new Set(); window.observer = this; }
      observe(target) { this.targets.add(target); }
      unobserve(target) { this.targets.delete(target); }
      disconnect() { this.targets.clear(); }
    };
  }
  vm.runInNewContext(source, { document, window });
  return { ids, root, link, brand, window, storage, document, reduce, desktop, reveals };
};

test("테마 상태를 저장하고 다음 초기화에서 복원한다", () => {
  const first = setup();
  first.ids["theme-toggle"].emit("click");
  assert.equal(first.root.getAttribute("data-theme"), "dark");
  assert.equal(first.storage.get("portfolio-theme"), "dark");
  assert.equal(first.ids["theme-toggle"].getAttribute("aria-label"), "라이트 모드로 전환");
  const next = setup({ storage: first.storage });
  assert.equal(next.root.getAttribute("data-theme"), "dark");
  next.ids["theme-toggle"].emit("click");
  assert.equal(next.root.getAttribute("data-theme"), "light");
});

test("저장소 접근 실패와 잘못된 테마 값에서도 화면을 전환한다", () => {
  const blocked = setup({ blockedStorage: true });
  assert.doesNotThrow(() => blocked.ids["theme-toggle"].emit("click"));
  assert.equal(blocked.root.getAttribute("data-theme"), "dark");
  assert.equal(setup({ storage: new Map([["portfolio-theme", "invalid"]]) }).root.getAttribute("data-theme"), "light");
});

test("메뉴 상태와 aria를 렌더링하고 Escape·앵커·데스크톱 복귀에서 닫는다", () => {
  const app = setup();
  const button = app.ids["menu-toggle"];
  button.emit("click");
  assert.equal(app.ids["site-nav"].classList.contains("active"), true);
  assert.equal(button.getAttribute("aria-expanded"), "true");
  app.document.emit("keydown", { key: "Escape" });
  assert.equal(button.getAttribute("aria-expanded"), "false");
  assert.equal(button.focused, true);
  button.emit("click");
  let prevented = false;
  app.link.emit("click", { preventDefault: () => { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(button.getAttribute("aria-expanded"), "false");
  assert.equal(app.ids.about.scrollOptions.behavior, "smooth");
  assert.equal(app.window.hash, "#about");
  button.emit("click");
  app.desktop.emit(true);
  assert.equal(button.getAttribute("aria-expanded"), "false");
});

test("60px·300px 경계와 맨 위로 이동을 정확하게 처리한다", () => {
  const app = setup();
  const scroll = (position) => { app.window.scrollY = position; app.window.emit("scroll"); };
  scroll(59); assert.equal(app.ids["site-header"].classList.contains("scrolled"), false);
  scroll(60); assert.equal(app.ids["site-header"].classList.contains("scrolled"), true);
  scroll(299); assert.equal(app.ids["back-to-top"].hidden, true);
  scroll(300); assert.equal(app.ids["back-to-top"].hidden, false);
  app.ids["back-to-top"].emit("click");
  assert.equal(app.window.scrollOptions.top, 0);
  assert.equal(app.ids["back-to-top"].hidden, true);
  assert.equal(app.brand.focused, true);
});

test("Observer 0.2와 reduced-motion·미지원 안전 동작을 제공한다", () => {
  const app = setup();
  assert.equal(app.window.observer.options.threshold, 0.2);
  assert.equal(app.root.classList.contains("motion-enabled"), true);
  const target = app.reveals[0];
  app.window.observer.callback([{ target, isIntersecting: true, intersectionRatio: 0.2 }]);
  assert.equal(target.classList.contains("visible"), true);
  assert.equal(app.window.observer.targets.has(target), false);
  app.reduce.emit(true);
  assert.equal(app.root.classList.contains("motion-enabled"), false);
  assert.equal(app.reveals.every((element) => element.classList.contains("visible")), true);
  const reduced = setup({ reduced: true });
  reduced.link.emit("click", { preventDefault() {} });
  assert.equal(reduced.ids.about.scrollOptions.behavior, "auto");
  assert.equal(setup({ observer: false }).root.classList.contains("motion-enabled"), false);
});
