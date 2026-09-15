# 홍용재 포트폴리오

Backend / AI Platform Engineer 홍용재의 반응형 단일 페이지입니다. 순수 HTML5, CSS3, JavaScript ES6+로 구현했습니다.

- 저장소: [CodysseyHaru2/Codyssey_B1_1](https://github.com/CodysseyHaru2/Codyssey_B1_1/tree/codex/portfolio-pages)
- 공개 페이지: 게시 확인 중
- 원본 PDF, 전화번호, 작업 기록, API 토큰, 내부 장비 주소는 배포에 포함하지 않습니다.

## 구조와 실행

`index.html`, `css/style.css`, `js/main.js`, `js/projects.js`, `js/contact.js`, `images/`를 사용합니다. 프레임워크와 런타임 라이브러리가 없습니다. VS Code에서 index.html을 Live Server로 열거나 Python 3의 `python3 -m http.server 4173 --bind 127.0.0.1`로 로컬 실행합니다.

Hero / About / Skills / Projects / Contact / Footer를 갖췄으며 CSS 변수, Flexbox, auto-fit/minmax Grid, 768px/1024px 미디어 쿼리를 사용합니다. 이미지 alt, 연결된 label, 오류 설명, 키보드 focus를 제공합니다.

## 기능과 학습 흐름

- 모바일 메뉴: active/aria-expanded 동기화, 링크 및 Escape로 닫기.
- 앵커의 부드러운 이동과 대상 포커스.
- 스크롤 300px 이상 상단 버튼, 60px 이상 헤더 배경.
- 라이트/다크 전환과 localStorage 복원. 저장 차단 시에도 전환 가능.
- IntersectionObserver threshold 0.2 등장 효과. 움직임 축소/미지원 대응.
- 실제 GitHub 공개 저장소 fetch와 loading/success/error/empty 상태, 요청 제한 및 재시도.
- 이름/이메일/메시지 검증과 인접 오류, 새로고침 없는 데모 확인.

테마 click → theme 상태 → renderTheme, API 요청/재시도 → phase/repos/error 상태 → render, 폼 input/submit → values/errors/phase 상태 → renderField/renderStatus로 이벤트·상태·DOM 렌더를 분리합니다. const/let, 화살표 함수, 구조분해, 템플릿 리터럴, map/forEach, addEventListener를 사용하고 외부 JS를 defer로 연결합니다.

## 제한과 검증

문의 폼은 학습용이며 **실제로 전송되지 않습니다**. 실제 연락은 페이지의 공개 이메일 링크를 사용합니다. GitHub API는 비인증 요청 제한이 있으며 토큰을 공개하지 않습니다. 실제 응답에 없는 Loom/DeepQuest 카드를 만들지 않고 누락을 안내합니다. 이미지들은 실제 운영 화면이 아닌 이니셜과 구조 요약도입니다.

2026-09-15 로컬 Node 내장 자동 테스트 20/20 통과 및 앱 브라우저 반응형·상태 UI 확인. 앱 브라우저 결과를 Chrome 결과로 대신하지 않으며 **Chrome 기능·반응형·콘솔 최종 검증은 미완료**입니다.
