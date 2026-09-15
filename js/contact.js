"use strict";

(() => {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  const submit = document.querySelector("#form-submit");
  const fields = {
    name: document.querySelector("#contact-name"),
    email: document.querySelector("#contact-email"),
    message: document.querySelector("#contact-message")
  };
  const errorNodes = {
    name: document.querySelector("#name-error"),
    email: document.querySelector("#email-error"),
    message: document.querySelector("#message-error")
  };
  const state = { values: { name: "", email: "", message: "" }, errors: {}, touched: {}, phase: "idle" };
  const validateField = (name) => {
    const value = state.values[name].trim();
    if (name === "name" && !value) return "이름을 입력해주세요";
    if (name === "message" && !value) return "메시지를 입력해주세요";
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "올바른 이메일 주소를 입력해주세요";
    return "";
  };
  const renderField = (name) => {
    const error = state.errors[name] || "";
    errorNodes[name].textContent = error;
    errorNodes[name].hidden = !error;
    fields[name].setAttribute("aria-invalid", String(Boolean(error)));
  };
  const renderStatus = () => {
    status.hidden = state.phase === "idle";
    status.classList.toggle("error", state.phase === "error");
    status.textContent = state.phase === "success"
      ? "입력 내용을 확인했습니다. 이 데모에서는 메시지가 실제로 전송되지 않습니다."
      : state.phase === "error" ? "입력 내용을 확인해주세요. 표시된 항목을 수정한 뒤 다시 확인할 수 있습니다." : "";
  };

  Object.entries(fields).forEach(([name, field]) => {
    field.addEventListener("input", () => {
      state.values[name] = field.value;
      state.touched[name] = true;
      state.errors[name] = validateField(name);
      state.phase = "idle";
      renderField(name);
      renderStatus();
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    Object.entries(fields).forEach(([name, field]) => {
      // 자동 완성처럼 input 이벤트가 없었던 값도 제출 시 읽습니다.
      state.values[name] = field.value;
      state.touched[name] = true;
      state.errors[name] = validateField(name);
      renderField(name);
    });
    const firstInvalid = Object.keys(fields).find((name) => state.errors[name]);
    state.phase = firstInvalid ? "error" : "success";
    renderStatus();
    if (firstInvalid) fields[firstInvalid].focus();
    // 학습용 확인만 수행합니다. fetch·메일 전송·입력 저장은 없습니다.
  });

  submit.disabled = false;
})();
