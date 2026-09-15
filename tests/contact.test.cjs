const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const source = fs.readFileSync(path.join(__dirname, "../js/contact.js"), "utf8");

const setup = () => {
  const ids = {};
  ["contact-form", "form-status", "form-submit", "contact-name", "contact-email", "contact-message", "name-error", "email-error", "message-error"].forEach((id) => {
    ids[id] = { value: "", textContent: "", hidden: true, disabled: true, events: {}, attrs: {}, classes: new Set(), setAttribute(name, value) { this.attrs[name] = value; }, addEventListener(name, callback) { this.events[name] = callback; }, focus() { this.focused = true; } };
    ids[id].classList = { toggle: (name, force) => force ? ids[id].classes.add(name) : ids[id].classes.delete(name) };
  });
  vm.runInNewContext(source, {
    document: { querySelector: (selector) => ids[selector.slice(1)] },
    fetch: () => { throw Error("폼이 네트워크를 사용했습니다"); },
    localStorage: { setItem: () => { throw Error("폼이 입력을 저장했습니다"); } }
  });
  let prevented = 0;
  const send = () => ids["contact-form"].events.submit({ preventDefault: () => { prevented += 1; } });
  const input = (name, value) => { ids[`contact-${name}`].value = value; ids[`contact-${name}`].events.input(); };
  return { ids, send, input, prevented: () => prevented };
};

test("초기 필드에 오류를 표시하지 않고 빈 제출을 막으며 첫 오류에 포커스한다", () => {
  const app = setup();
  assert.equal(app.ids["form-submit"].disabled, false);
  assert.equal(app.ids["name-error"].hidden, true);
  app.send();
  assert.equal(app.prevented(), 1);
  assert.equal(app.ids["name-error"].textContent, "이름을 입력해주세요");
  assert.equal(app.ids["email-error"].textContent, "올바른 이메일 주소를 입력해주세요");
  assert.equal(app.ids["message-error"].textContent, "메시지를 입력해주세요");
  assert.equal(app.ids["contact-name"].focused, true);
  assert.equal(app.ids["contact-email"].attrs["aria-invalid"], "true");
  assert.equal(app.ids["form-status"].classes.has("error"), true);
});

test("공백·부분 입력·잘못된 이메일은 성공하지 않으며 수정한 필드의 오류를 갱신한다", () => {
  const app = setup();
  app.input("name", "   ");
  app.input("message", "\n\t");
  for (const email of ["", "a", "a@b", "a b@example.com", "a@@example.com"]) {
    app.input("email", email);
    app.send();
    assert.match(app.ids["form-status"].textContent, /수정/);
  }
  app.input("name", "테스트 사용자");
  assert.equal(app.ids["name-error"].hidden, true);
  assert.equal(app.ids["contact-name"].attrs["aria-invalid"], "false");
  assert.equal(app.ids["message-error"].hidden, false);
  app.input("email", "test+portfolio@example.com");
  assert.equal(app.ids["email-error"].hidden, true);
});

test("정상 입력·반복 제출은 전송 없는 데모 성공이며 이후 수정하면 이전 성공을 지운다", () => {
  const app = setup();
  app.input("name", " 테스트 ");
  app.input("email", " test@example.com ");
  app.input("message", "<script>실행하지 않는 입력</script>");
  app.send(); app.send();
  assert.equal(app.prevented(), 2);
  assert.match(app.ids["form-status"].textContent, /실제로 전송되지 않습니다/);
  assert.equal(app.ids["form-status"].classes.has("error"), false);
  assert.equal(app.ids["contact-message"].value, "<script>실행하지 않는 입력</script>");
  app.input("message", "수정");
  assert.equal(app.ids["form-status"].hidden, true);
  assert.equal(app.ids["form-status"].textContent, "");
});

test("input 이벤트 없이 자동 완성된 값도 제출 시 전체 검증한다", () => {
  const app = setup();
  app.ids["contact-name"].value = "테스트";
  app.ids["contact-email"].value = "test@example.com";
  app.ids["contact-message"].value = "피드백";
  app.send();
  assert.match(app.ids["form-status"].textContent, /입력 내용을 확인했습니다/);
});
