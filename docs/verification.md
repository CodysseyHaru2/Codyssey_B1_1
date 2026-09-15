# 소개 페이지 구현·검증 기록

시험일: 2026-09-15 (Asia/Seoul). 대상: 로컬 `http://127.0.0.1:4173/`. 공개 Pages 검증이 아니다.

## 환경과 판정 원칙

- 앱 브라우저: 실제 DOM/AX/화면 및 viewport 제어로 검증. 엔진 버전은 확인할 수 없어 기재하지 않는다.
- Chrome: 설치 메타데이터 버전 153.0.8010.36. 실제 네이티브 창에서 주소 입력·로드·재로딩까지 시도했지만 빈 화면이고 문서 AX가 없어 **미검증**이다. 앱 브라우저 결과를 Chrome PASS로 쓰지 않는다.
- Node 24.19.0의 내장 테스트/VM 사용. 실제 브라우저를 대체하지 않는 로직 시험이다.
- PASS는 아래 방식으로 확인한 항목에만 적용한다. 미검증은 불합격 또는 합격으로 바꾸지 않는다.

## 검증 결과

`node --check` 3파일 및 `git diff --check` 통과. `node --test tests/*.test.cjs` **20개 통과 / 0개 실패**.

| ID | 필수 요구사항 | 코드·시험 근거 | 판정 |
| --- | --- | --- | --- |
| R1 | 기본 구조·외부 CSS/defer JS·실행 안내 | index.html/css/js/images, structure test, README Live Server 안내, 로컬 HTTP 200 | PASS (로컬) |
| R2 | 6영역·시맨틱·앵커·alt·label | structure test, 실제 DOM의 고유 ID/label 연결/이미지, 앱 AX | PASS |
| R3 | 변수·dark·Flex/Grid·반응형·hover/transition/shadow | style.css, structure test, 아래 실제/대체 성공 6폭 점검·라이트/다크 캡처 | PASS (앱/QA 대체 응답) |
| R4 | DOM 선택·이벤트·preventDefault·금지 코드 없음 | 3 JS, structure test, 실제 메뉴/폼 click/input/submit/scroll | PASS |
| R5 | 메뉴·smooth·top·nav·theme·Observer | UI test 5개, 앱에서 테마 복원/메뉴 닫기/앵커/상단/등장 확인 | PASS (앱/로직) |
| R6 | 필수값·이메일·인접 오류·성공 | contact test 4개, 앱에서 빈 제출·잘못된 이메일·수정·데모 성공과 포커스 | PASS |
| R7 | ES6+ | map/template/destructuring으로 카드 생성, const/let·화살표·forEach 실제 사용, structure test | PASS |
| R8 | fetch/비동기·4상태·403/재시도 | projects test 6개, 공개 API curl 및 앱 실 성공 10개, 이후 제한/재시도 안내 | PASS (앱/로직) |
| R9 | 최소 3개 상태→렌더 | README 테마/API/폼 흐름 표와 함수, 위 상태 시험 | PASS |
| R10 | GitHub Pages·README·URL·3캡처 제출 | README와 실제 3 PNG 작성. 기존 remote는 있으나 이번 변경 미push. Pages URL 없음 | 부분 완료 / 배포 미검증 |

전체 과제 완료 판정: **아직 아님**. Chrome 및 공개 배포/제출 URL이 남아 있다.

## 실제 반응형 경계

새 코드 로드 후 앱 브라우저에서 각 폭을 설정하고 실제 innerWidth를 확인했다. 페이지 전체 문서 폭은 clientWidth와 같았다. 15px 차이는 세로 스크롤바 공간이며 가로 넘침이 아니다.

| CSS viewport 폭 | clientWidth / documentWidth | nav / 메뉴 버튼 | 섹션 간격 | 이미지/label |
| --- | --- | --- | --- | --- |
| 360 | 345 / 345 | none / flex | 5rem | 깨짐 없음 / 연결 정상 |
| 767 | 752 / 752 | none / flex | 5rem | 깨짐 없음 / 연결 정상 |
| 768 | 753 / 753 | flex / none | 6rem | 깨짐 없음 / 연결 정상 |
| 1023 | 1008 / 1008 | flex / none | 6rem | 깨짐 없음 / 연결 정상 |
| 1024 | 1009 / 1009 | flex / none | 7rem | 깨짐 없음 / 연결 정상 |
| 1280 | 1265 / 1265 | flex / none | 7rem | 깨짐 없음 / 연결 정상 |

이 실제 API 6폭 시험에서는 요청 제한 상태여서 카드 수 0이었다. 카드 10개가 있는 실 응답 화면은 앞선 앱 시험에서 확인했다. API를 반복 호출하는 대신 QA 전용 서버의 4카드 대체 성공 응답으로 6폭을 추가 검증했다. 긴 이름·누락값·fork·TinyPilot 이미지가 포함되며 사용자 실 프로젝트 4개라는 뜻이 아니다. 임시 viewport는 reset했다.

| QA 성공 viewport | 카드 수 | 카드 폭 | 카드 내부 가로 넘침 | 문서 넘침 |
| --- | --- | --- | --- | --- |
| 360 | 4 | 305px | 0개 | 없음 |
| 767 | 4 | 344px | 0개 | 없음 |
| 768 | 4 | 332.5px | 0개 | 없음 |
| 1023 | 4 | 460px | 0개 | 없음 |
| 1024 | 4 | 460.5px | 0개 | 없음 |
| 1280 | 4 | 약 378.66px | 0개 | 없음 |

## 자동 상태 시험의 범위

| 시험 파일 | 건수 | 재현·확인 |
| --- | --- | --- |
| ui.test.cjs | 5 | 테마 저장/복원/저장 차단, 메뉴/Escape/앵커/데스크톱 복귀, 59↔60/299↔300, top 이동, Observer 0.2와 reduced-motion/미지원 |
| projects.test.cjs | 6 | 지연 loading→success, 대표 순서·미일치·누락값·fork, []/HTTP500/403/429/네트워크/잘못된 응답, 중복 재시도, 악성 HTML/URL, 페이지네이션·중복·비공개 제외 |
| contact.test.cjs | 4 | 초기/빈·공백·부분/잘못된 이메일·수정, 정상/반복 데모 확인·성공 해제, input 없는 자동 완성 |
| structure.test.cjs | 5 | 시맨틱/6영역/ID·앵커, 외부 defer/자산/alt, label/필수/오류·전송 없음, CSS 조건, DOM/이벤트/ES6·금지 패턴 |

대체 응답은 테스트 VM과 별도 localhost QA 서버에서만 제공한다. 운영 사이트에 성공 fixture·토큰·상태 시험 스위치를 넣지 않았다. VM 시험은 실제 HTML 레이아웃·브라우저 네트워크·보조기기의 읽기 경험을 증명하지 않는다.

`tests/browser-server.cjs`는 4174의 허용된 시험 경로/자산만 제공하고 메모리에서 endpoint만 바꾼다. 실제 js/projects.js를 수정하지 않는다. 앱 브라우저에서 success=4카드, empty=빈 안내/0카드, HTTP500=오류+재시도, HTTP403=제한+재시도, loading=로딩/aria-busy=true를 확인했다. 모바일 Escape는 메뉴 닫힘과 menu-toggle 포커스를 확인했다. 시험 탭과 QA 서버는 종료했다.

## 실제 앱 브라우저 기능 기록

- dark 클릭 후 data-theme=dark/안내=라이트 전환을 확인하고 새로고침 후 유지. light로 복원.
- 360px에서 메뉴 active/aria-expanded=true, 소개 링크 선택 후 false 및 섹션 포커스·hash 확인.
- 소개 이동 후 scrolled 헤더/상단 버튼/등장 visible 확인. 상단 버튼 클릭의 브랜드 포커스 확인.
- 빈 폼 제출: 이름/이메일/메시지 3오류와 첫 필드 포커스. 부분 수정 후 이메일 오류만 유지. 정상 수정 후 전송되지 않는 데모 성공 확인.
- 같은 시험에서 공개 GitHub 10개 및 TinyPilot-KVM-Docker 이미지·설명·C·스타0·링크가 실제 표시됐다. Loom/DeepQuest 미포함 안내도 확인했다.
- 폼/성공 API 시험의 console error/warn 로그는 `[]`였다. 이후 최종 로드에서 요청 제한 안내와 재시도 버튼을 확인했고 재시도 후에도 제한 안내였다. 모든 환경·모든 시간에 콘솔이 비었다고 주장하지 않는다.
- 최종 Hero 라이트/모바일/다크 화면을 시각 검사해 제목·CTA·메뉴·테마 버튼의 잘림이 없음을 확인했다.

## 캡처 증거

- [desktop.png](screenshots/desktop.png): 1280×900 viewport의 Hero 라이트.
- [mobile.png](screenshots/mobile.png): 360×780 viewport의 Hero 라이트.
- [dark.png](screenshots/dark.png): 1280×900 viewport의 Hero 다크.

세 파일은 실제 앱 브라우저 캡처다. 설정 viewport 전체와 저장 영역이 같지는 않으며 PNG 실 크기는 desktop/dark=1265×889, mobile=345×748이다. Chrome 화면 또는 API 성공 카드의 캡처로 표시하지 않는다. 실제 인물 사진/운영 화면/실측 성과 도표가 아닌 HYJ 및 구조 요약 SVG를 사용한다.

## 콘텐츠·공개 범위

이력서와 기존 사이트가 제공한 직무·기술·프로젝트 역할을 사용했다. 기간과 블로그 주소가 충돌해 생략했다. 전화번호/원본 이력서 다운로드/실제 장비 제어 주소는 없다. AI ops/s와 HTTP req/s를 합산하거나 목표 처리량을 성과로 표현하지 않았다. 성과의 독립 재측정도 수행하지 않았다.

공개 API에는 Loom/DeepQuest가 없으므로 대표 카드 성공 데이터를 하드코딩하지 않는다. 이들의 경험은 About/Skills의 출처 있는 설명에 남긴다. 공개 전 이들을 별도 사례 소개로 확장할지는 후속 사용자 결정이다.

## 남은 제출·확인

1. 안정된 Chrome에서 6폭과 성공 카드·메뉴·테마 복원·Observer·폼·콘솔을 확인하고 실제 버전/결과 기록.
2. 공개 저장소 및 Git 기록/콘텐츠 범위 선택. 현 origin은 CodysseyHaru2/Codyssey_B1_1이나 선택·push·공개 승인을 대신하지 않는다.
3. GitHub Pages 배포 시 index.html/css/js/images만 선별. `.loom`·PDF·작업 로그를 웹 자산으로 게시하지 않음.
4. 외부 GitHub 저장소 URL·실제 Pages URL·상대 자산·핵심 동작 확인 후 README 갱신.
5. 배포 화면으로 제출용 3캡처를 다시 생성할 경우 이 로컬 캡처와 구분해 기록.
