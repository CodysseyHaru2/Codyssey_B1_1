# 포트폴리오 평가 질문·답변 정리

2026-09-15 현재 코드 기준. 답변은 발표할 때 그대로 말할 수 있는 정도로 정리했습니다.
코드 링크는 로컬 저장소의 해당 줄로 연결됩니다. 아래 코드는 핵심 발췌이며, 생략된 부분은 `…`로 표시했습니다.

## 항목 1 — 기능 동작

### 1-1. 반응형 레이아웃

질문: 브라우저 창 크기를 줄였을 때 레이아웃이 모바일에 맞게 변경되는가?

답변: 네. 작은 화면을 기본으로 만들고, 768px부터 가로 메뉴와 다단 레이아웃을 적용하며 1024px부터 간격과 열 구성을 확장합니다. 프로젝트 카드는 Grid가 화면 폭에 맞춰 열 수를 자동 조절합니다.

관련 코드: [index.html:5 — viewport](/Users/hongyongjae/Desktop/Codyssey_B1_1/index.html:5), [css/style.css:136 — 카드 Grid](/Users/hongyongjae/Desktop/Codyssey_B1_1/css/style.css:136), [css/style.css:187 — 반응형 분기](/Users/hongyongjae/Desktop/Codyssey_B1_1/css/style.css:187).

```css
.projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr)); gap: 1.5rem; }
@media (min-width: 768px) {
  /* … */
  .menu-toggle { display: none; }
  /* … */
}
```

### 1-2. 테마 전환과 유지

질문: 테마 토글 버튼 클릭 시 다크/라이트 모드가 전환되고, 새로고침 후에도 유지되는가?

답변: 네. 클릭하면 테마 상태를 바꾸고 화면에 적용하면서 `localStorage`에 저장합니다. 처음 로드할 때 저장값을 다시 읽으므로 새로고침 후에도 유지되며, 저장소가 차단된 경우에는 현재 화면의 전환만 동작합니다.

관련 코드: [js/main.js:55 — 클릭 처리](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/main.js:55), [js/main.js:21 — 저장값 읽기](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/main.js:21), [js/main.js:29 — 화면 적용·저장](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/main.js:29), [js/main.js:138 — 초기 복원](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/main.js:138).

```js
themeButton.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  renderTheme(true);
});
```

### 1-3. 메뉴·스크롤·맨 위로 이동

질문: 햄버거 메뉴, 스크롤 애니메이션, 맨 위로 가기 버튼 등이 정상 동작하는가?

답변: 네. 햄버거 버튼은 메뉴 상태를 토글하고, Escape나 메뉴 링크 선택으로 닫힙니다. 요소가 20% 이상 보이면 등장 애니메이션을 적용하고, 300px 이상 스크롤하면 상단 이동 버튼을 표시합니다. 모션 줄이기 설정에서는 애니메이션 없이 동작합니다.

관련 코드: [js/main.js:60 — 메뉴 클릭](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/main.js:60), [js/main.js:90 — 상단 버튼 표시](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/main.js:90), [js/main.js:106 — 상단 이동](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/main.js:106), [js/main.js:125 — 등장 감지](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/main.js:125), [css/style.css:184 — 등장 효과](/Users/hongyongjae/Desktop/Codyssey_B1_1/css/style.css:184).

```js
state.menuOpen = !state.menuOpen;
renderMenu();
// … 서로 다른 처리 부분 발췌
topButton.hidden = state.scrollY < settings.topAt;
window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
// … IntersectionObserver 안에서
target.classList.add("visible");
```

### 1-4. GitHub API와 상태 구분

질문: GitHub API에서 데이터를 불러와 화면에 표시되고, 로딩/에러/빈 상태가 구분되는가?

답변: 네. `develsvai`의 공개 저장소를 받아 실제 응답으로 카드를 만들고, `phase`로 로딩·성공·빈 목록·오류를 구분합니다. 오류에는 다시 시도 버튼을 제공하며, 실제 응답에 없는 대표 프로젝트는 가짜 카드 대신 누락 안내를 표시합니다.

관련 코드: [js/projects.js:6 — API 주소](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/projects.js:6), [js/projects.js:49 — 상태별 화면](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/projects.js:49), [js/projects.js:70 — 데이터 요청](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/projects.js:70).

```js
if (state.phase === "loading") message.textContent = "GitHub 프로젝트를 불러오는 중입니다…";
if (state.phase === "empty") message.textContent = "표시할 프로젝트가 없습니다.";
if (state.phase === "error") message.textContent = state.error;
// … 요청 성공 후 목록 길이로 구분
state.phase = state.repos.length ? "success" : "empty";
```

### 1-5. 입력값 유효성 검사

질문: 필수 입력값 누락, 이메일 형식 오류 시 즉각적인 피드백이 표시되는가?

답변: 네. 입력 중에는 해당 필드를 검사해 바로 옆에 오류를 표시하고, 제출할 때는 모든 필드를 검사해 첫 오류로 포커스를 이동합니다. 공백만 입력한 값도 누락으로 처리하며, 이메일은 기본 형식을 검사합니다. 이 폼은 유효성 검사 데모로 실제 메시지는 전송하지 않습니다.

관련 코드: [js/contact.js:18 — 검사 규칙](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/contact.js:18), [js/contact.js:25 — 오류 표시](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/contact.js:25), [js/contact.js:39 — 입력 이벤트](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/contact.js:39), [js/contact.js:50 — 전체 검사·포커스](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/contact.js:50).

```js
const value = state.values[name].trim();
if (name === "name" && !value) return "이름을 입력해주세요";
if (name === "message" && !value) return "메시지를 입력해주세요";
if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "올바른 이메일 주소를 입력해주세요";
```

## 항목 2 — 구조와 작성 방식

### 2-1. HTML·CSS·JavaScript 파일 분리

질문: HTML, CSS, JavaScript가 각각의 파일로 분리되어 있고, 분리한 이유와 각 파일의 역할을 구분하여 답변할 수 있는가?

답변: 네. HTML은 콘텐츠와 구조, CSS는 디자인과 반응형 배치, JavaScript는 사용자 동작과 데이터 처리를 담당합니다. JS도 공통 UI(`main.js`), 프로젝트 API(`projects.js`), 폼 검사(`contact.js`)로 나눠 필요한 부분을 쉽게 찾고 수정할 수 있게 했습니다.

관련 코드: [index.html:10 — 외부 파일 연결](/Users/hongyongjae/Desktop/Codyssey_B1_1/index.html:10), [css/style.css:1 — 스타일](/Users/hongyongjae/Desktop/Codyssey_B1_1/css/style.css:1), [js/main.js:55 — UI](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/main.js:55), [js/projects.js:70 — API](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/projects.js:70), [js/contact.js:18 — 폼 검사](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/contact.js:18).

```html
<link rel="stylesheet" href="css/style.css">
<script src="js/main.js" defer></script>
<script src="js/projects.js" defer></script>
<script src="js/contact.js" defer></script>
```

### 2-2. 시맨틱 태그 선택

질문: header, nav, main, section, footer 등 시맨틱 태그를 사용했고, 어떤 기준으로 태그를 선택했는지 설명할 수 있는가?

답변: 네. 모양이 아니라 콘텐츠의 역할을 기준으로 골랐습니다. 상단 소개는 `header`, 주요 이동 메뉴는 `nav`, 핵심 본문은 `main`, 주제별 영역은 `section`, 하단 정보는 `footer`이며, 의미 없는 배치용 묶음만 `div`로 처리했습니다. 프로젝트처럼 독립적인 콘텐츠는 `article`로 만듭니다.

관련 코드: [index.html:17 — header](/Users/hongyongjae/Desktop/Codyssey_B1_1/index.html:17), [index.html:23 — nav](/Users/hongyongjae/Desktop/Codyssey_B1_1/index.html:23), [index.html:41 — main·section](/Users/hongyongjae/Desktop/Codyssey_B1_1/index.html:41), [index.html:140 — footer](/Users/hongyongjae/Desktop/Codyssey_B1_1/index.html:140), [js/projects.js:39 — article 카드](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/projects.js:39).

```html
<header class="site-header" id="site-header">
  <!-- … -->
  <nav class="site-nav" id="site-nav" aria-label="주요 메뉴">
    <!-- … -->
<main id="main-content">
  <section class="hero section" id="hero" aria-labelledby="hero-title">
```

### 2-3. CSS 변수의 이점

질문: CSS 변수(:root)로 색상, 폰트 등을 정의했고, 변수로 관리하면 어떤 이점이 있는지 구체적으로 답변할 수 있는가?

답변: 네. 색상·폰트·간격 등을 `:root`에 정의해 여러 요소에서 같은 값을 사용합니다. 대표 색상을 한 번 바꾸면 버튼과 텍스트 등 관련 요소에 함께 반영되고, 다크 모드는 같은 변수의 값만 덮어써 중복 스타일을 줄일 수 있습니다.

관련 코드: [css/style.css:1 — 변수 정의](/Users/hongyongjae/Desktop/Codyssey_B1_1/css/style.css:1), [css/style.css:30 — 다크 모드 값](/Users/hongyongjae/Desktop/Codyssey_B1_1/css/style.css:30), [css/style.css:50 — 변수 사용](/Users/hongyongjae/Desktop/Codyssey_B1_1/css/style.css:50).

```css
:root {
  --color-bg: #f3f5f6;
  --color-accent: #146e73;
  --font-body: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif;
  /* … */
}
[data-theme="dark"] {
  --color-bg: #101c23;
  /* … */
}
```

### 2-4. addEventListener 선택

질문: onclick 인라인 속성 대신 addEventListener를 사용한 이유를 두 방식의 차이를 비교하여 제시할 수 있는가?

답변: 인라인 `onclick`은 HTML에 동작 코드가 섞이지만, `addEventListener`는 JS 파일에서 동작을 따로 관리할 수 있습니다. 같은 이벤트에 여러 핸들러를 등록하거나 `passive` 같은 옵션을 지정할 수 있어 확장에도 유리합니다. 이 코드에서는 버튼 클릭과 스크롤 이벤트를 모두 이 방식으로 연결했습니다.

관련 코드: [index.html:30 — 동작 코드 없는 버튼](/Users/hongyongjae/Desktop/Codyssey_B1_1/index.html:30), [js/main.js:60 — 클릭 등록](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/main.js:60), [js/main.js:96 — passive 스크롤 등록](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/main.js:96).

```js
menuButton.addEventListener("click", () => {
  state.menuOpen = !state.menuOpen;
  renderMenu();
});
```

## 항목 3 — 코드 흐름 설명

### 3-1. 이벤트 → 상태 변경 → 화면 업데이트

질문: 다크 모드, API 호출, 폼 유효성 검사 중 하나를 예시로 들어, "이벤트 → 상태 변경 → 화면 업데이트" 흐름이 코드에서 어떻게 이어지는지 따라가며 짚어줄 수 있는가?

답변: 다크 모드로 설명할 수 있습니다. 버튼의 `click` 이벤트가 `state.theme`을 바꾸고 `renderTheme(true)`를 호출합니다. 이 함수가 HTML의 `data-theme`와 버튼 아이콘·안내를 바꾸면, CSS의 다크 모드 변수가 적용되어 화면 색상이 변경됩니다.

관련 코드: [js/main.js:55 — 이벤트·상태 변경](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/main.js:55), [js/main.js:29 — 화면 업데이트](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/main.js:29), [css/style.css:30 — 다크 스타일](/Users/hongyongjae/Desktop/Codyssey_B1_1/css/style.css:30).

```js
state.theme = state.theme === "dark" ? "light" : "dark";
renderTheme(true);
// … renderTheme 함수 안에서
root.setAttribute("data-theme", state.theme);
```

### 3-2. async/await와 try/catch

질문: async/await와 try/catch를 사용하여 API 호출 성공과 실패를 어떻게 분기 처리했는지 코드 흐름을 따라 답변할 수 있는가?

답변: `async` 함수에서 `await fetch()`와 `await response.json()`으로 응답을 기다립니다. HTTP 오류는 `fetch`만으로 예외가 되지 않으므로 `response.ok`를 검사해 직접 던지고, 성공하면 목록에 따라 성공·빈 상태로, `catch`에서는 오류 상태로 바꿉니다. 마지막 `finally`에서 타이머를 정리하고 결과 화면을 그립니다.

관련 코드: [js/projects.js:70 — loadProjects 전체 흐름](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/projects.js:70), [js/projects.js:83 — HTTP 오류 검사](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/projects.js:83), [js/projects.js:103 — 성공·실패·마무리](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/projects.js:103).

```js
const loadProjects = async () => {
  // …
  try {
    // … 페이지별 요청
    const response = await fetch(`${endpoint}?per_page=100&sort=pushed&page=${page}`, { signal: controller.signal, headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) {
      const error = new Error("GitHub 응답 오류");
      error.status = response.status;
      throw error;
    }
    const data = await response.json();
    // … 목록 검증·가공 후
    state.phase = state.repos.length ? "success" : "empty";
  } catch (error) {
    state.repos = [];
    state.phase = "error";
    // … 오류 안내 설정
  } finally {
    clearTimeout(timeout);
    render();
  }
  // …
};
```

### 3-3. 배열 데이터를 카드 UI로 변환

질문: map, filter 등 배열 메서드를 활용하여 GitHub 데이터를 카드 UI로 변환하는 과정을 단계별로 정리할 수 있는가?

답변: 먼저 `filter`로 잘못된 값·비공개·중복 저장소를 제외하고, `sort`로 대표 프로젝트를 앞에 둡니다. 그다음 `map(cardHTML)`으로 저장소 하나씩 카드 HTML로 바꾸고 `join("")`으로 합쳐 화면에 넣습니다. 카드 함수에서는 이름·설명 등을 HTML 이스케이프해 데이터가 태그로 실행되지 않게 합니다.

관련 코드: [js/projects.js:95 — filter·sort](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/projects.js:95), [js/projects.js:31 — cardHTML](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/projects.js:31), [js/projects.js:52 — map·join·화면 반영](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/projects.js:52), [js/projects.js:17 — HTML 이스케이프](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/projects.js:17).

```js
state.repos = all.filter((repo) => {
  if (!repo || typeof repo.name !== "string" || !repo.name.trim() || repo.private) return false;
  // … 이름 중복 제거
  return true;
}).sort((a, b) => (detailFor(a.name)?.rank ?? 3) - (detailFor(b.name)?.rank ?? 3));
// … render 함수에서 카드로 변환
grid.innerHTML = state.phase === "success" ? state.repos.map(cardHTML).join("") : "";
```

### 3-4. Flexbox와 Grid 선택

질문: Flexbox와 Grid를 각각 어디에 적용했는지 확인하고 해당 상황에서 그 방식을 선택한 이유를 비교하여 설명할 수 있는가?

답변: Flexbox는 헤더의 로고·버튼 정렬, 버튼 묶음, 카드 내부처럼 한 방향의 배치와 간격 조절에 사용했습니다. Grid는 프로젝트 카드 목록과 넓은 화면의 소개·연락 영역처럼 여러 열을 구성하는 데 사용했습니다. 카드 목록은 Grid로 열을 맞추고, 카드 내부는 Flex로 세로 흐름을 관리하는 식으로 함께 씁니다.

관련 코드: [css/style.css:78 — 헤더 Flex](/Users/hongyongjae/Desktop/Codyssey_B1_1/css/style.css:78), [css/style.css:136 — 카드 목록 Grid](/Users/hongyongjae/Desktop/Codyssey_B1_1/css/style.css:136), [css/style.css:140 — 카드 내부 Flex](/Users/hongyongjae/Desktop/Codyssey_B1_1/css/style.css:140), [css/style.css:205 — 연락 영역 Grid](/Users/hongyongjae/Desktop/Codyssey_B1_1/css/style.css:205).

```css
.header-inner { display: flex; align-items: center; gap: var(--space-sm); min-height: var(--header-height); }
.projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr)); gap: 1.5rem; }
.project-content { display: flex; flex-direction: column; flex: 1; padding: 1.5rem; }
```

## 항목 4 — 설계 이유

### 4-1. 상태 객체를 사용한 이유

질문: 상태(STATE) 객체를 따로 만들어서 관리한 이유는 무엇이며, 그냥 변수로 처리하면 안되는 지 설명할 수 있는가?

답변: 개별 변수로 처리해도 됩니다. 다만 관련 상태를 객체로 모으면 현재 UI·API·폼 상태를 한눈에 파악하고 렌더 함수에서 일관되게 참조하기 쉽습니다. 실제 이름은 `state`이고 파일별로 따로 관리하며, 값 변경만으로 화면이 자동 갱신되는 것은 아니어서 직접 렌더 함수를 호출합니다.

관련 코드: [js/main.js:14 — UI 상태](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/main.js:14), [js/projects.js:7 — API 상태](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/projects.js:7), [js/contact.js:17 — 폼 상태](/Users/hongyongjae/Desktop/Codyssey_B1_1/js/contact.js:17).

```js
// main.js
const state = { theme: "light", menuOpen: false, scrollY: window.scrollY };
// projects.js
const state = { phase: "idle", repos: [], error: "", missing: [] };
// contact.js
const state = { values: { name: "", email: "", message: "" }, errors: {}, touched: {}, phase: "idle" };
```

### 4-2. 모바일 퍼스트 작성 이유

질문: 반응형 디자인에서 "모바일 퍼스트"로 작성한 이유를 이야기할 수 있는가?

답변: 좁은 화면에서도 읽기 쉽고 조작 가능한 기본 구성을 먼저 확보하기 위해서입니다. 기본 CSS는 세로 배치로 작성하고, `min-width` 조건에서 가로 배치와 다단 구성을 추가했습니다. 큰 화면용 스타일을 모바일에서 계속 취소하는 방식보다 필요한 확장 규칙을 관리하기 쉽습니다.

관련 코드: [css/style.css:124 — 기본 세로 배치](/Users/hongyongjae/Desktop/Codyssey_B1_1/css/style.css:124), [css/style.css:187 — 768px 확장](/Users/hongyongjae/Desktop/Codyssey_B1_1/css/style.css:187), [css/style.css:210 — 1024px 확장](/Users/hongyongjae/Desktop/Codyssey_B1_1/css/style.css:210).

```css
.section-heading { display: flex; flex-direction: column; gap: var(--space-md); margin-bottom: var(--space-lg); }
@media (min-width: 768px) {
  /* … */
  .section-heading { flex-direction: row; align-items: end; justify-content: space-between; gap: 3rem; }
  /* … */
}
```

## 검증 범위 참고

[배포·검증 기록](/Users/hongyongjae/Desktop/Codyssey_B1_1/docs/deployment.md) 기준으로, 공개 페이지의 앱 브라우저에서 반응형·테마 유지·메뉴·폼 동작을 확인했습니다. API 오류·빈 상태·재시도 등은 동일 코드의 로컬 제어 응답과 자동 시험으로 확인했습니다. Chrome 최종 시험은 미완료이며, 이메일 형식 검사는 실제 주소의 존재 여부를 보장하지 않습니다.
