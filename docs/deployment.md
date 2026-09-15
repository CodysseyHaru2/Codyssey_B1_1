# GitHub Pages 배포 기록

배포·확인일: 2026-09-15 (Asia/Seoul).

- 공개 페이지: [홍용재 소개 페이지](https://codysseyharu2.github.io/Codyssey_B1_1/)
- 저장소: [CodysseyHaru2/Codyssey_B1_1](https://github.com/CodysseyHaru2/Codyssey_B1_1)
- 공개 소스: [codex/portfolio-pages](https://github.com/CodysseyHaru2/Codyssey_B1_1/tree/codex/portfolio-pages)
- Pages source: `codex/portfolio-pages`, `/`, `legacy` 브랜치 게시 방식. HTTPS enforced=true, 커스텀 도메인 없음.
- 최초 배포 커밋: `69600e80d99b0d7b58d113ffa114da6fcb6fede5`. Pages build는 `built`, error.message=null이었다.
- 최종 제출 커밋: `ed53f3b4a3ec12ec44436a36a2080a46125cba97`. 공개 README의 실제 URL 및 공개 PNG 화면 3장을 포함한다.
- 최종 Pages build: `built`, error.message=null, 2026-09-15T07:25:38Z. 공개 README/PNG 3장은 모두 HTTP 200, 배포 커밋 파일과 바이트 단위 일치, PNG MIME=image/png 확인.

## 승인과 공개 경계

사용자가 기존 저장소를 선택하고 현재 에이전트에게 즉시 배포를 지시했다. 저장소는 이미 PUBLIC이고 현재 로그인 계정에 ADMIN 권한이 있었다. 최초 Pages 조회는 404였으므로 기존 게시물을 덮어쓰지 않았다. 저장소 공개 범위, 기본 브랜치, 기존 main의 파일·이력을 변경하지 않았다.

로컬 develop에는 PDF와 Loom 실행 기록이 포함되므로 그 브랜치/전체 Git 이력을 push하지 않았다. 별도의 독립 배포 브랜치에 허용된 파일만 선별했으며 force push나 기존 원격 변경 취소를 사용하지 않았다.

공개 파일: `index.html`, `css/style.css`, `js/main.js`, `js/projects.js`, `js/contact.js`, `images/`의 SVG 4개, `.nojekyll`, 개인정보 없는 생성 README, 공개 페이지 화면 3장. 로컬 요구사항/검증/작업 문서, PDF, 전화번호, API 토큰, QA 서버, 실제 운영 장비 제어 링크는 제외했다.

## 검증 결과

### 외부 접근과 자산

비인증 HTTPS 요청에서 공개 소스 URL은 HTTP 200이었다. Pages의 `index.html`, CSS 1개, JS 3개, SVG 4개는 모두 HTTP 200, 올바른 MIME type, 로컬 소스와 바이트 단위 일치였다. repository subpath에서 상대 자산이 정상 로드되므로 루트 도메인 배포로만 성립하는 경로가 아니다.

`.loom/project.md`와 `홍용재 4.pdf`는 HTTP 404. GitHub 배포 브랜치의 recursive tree는 허용한 파일만 포함했다. 민감 문자열 검사에서 토큰/개인키/전화번호/개인 로컬 경로/원 ts.net 운영 주소가 없었다. 검사 코드는 데이터 필터의 localhost 거부 로직을 실제 제어 링크와 혼동하지 않는다.

### 실제 공개 페이지의 앱 브라우저

페이지 제목과 Hero/About/Skills/Projects/Contact/Footer, HYJ 이미지, 이메일·GitHub·LinkedIn 링크를 확인했다. 엔진 버전은 확인할 수 없어 기록하지 않으며 Chrome 시험이라고 표현하지 않는다.

실제 GitHub 응답의 공개 저장소 10개가 표시됐고 TinyPilot-KVM-Docker의 구조 이미지·설명·C·스타0·저장소 링크가 정상 표시됐다. Loom/DeepQuest는 실제 응답에 없어 누락 안내만 표시됐다. 최초 로딩 안내에서 성공 상태로 전환되는 것도 관찰했다.

| CSS viewport | clientWidth / documentWidth | 실제 카드 | 카드 내부 넘침 | 메뉴 |
| --- | --- | --- | --- | --- |
| 360 | 345 / 345 | 10 | 0 | 모바일 |
| 767 | 752 / 752 | 10 | 0 | 모바일 |
| 768 | 753 / 753 | 10 | 0 | 데스크톱 |
| 1023 | 1008 / 1008 | 10 | 0 | 데스크톱 |
| 1024 | 1009 / 1009 | 10 | 0 | 데스크톱 |
| 1280 | 1265 / 1265 | 10 | 0 | 데스크톱 |

모든 폭에서 깨진 이미지가 없었다. 15px 차이는 세로 스크롤바 공간이다. temporary viewport는 시험 후 reset했다.

- 테마 버튼으로 dark 상태/라이트 전환 안내를 확인했고 새로고침 후 dark 복원 확인. 이후 light로 복원.
- 모바일 메뉴 active/aria-expanded=true, Escape로 false 및 menu-toggle 포커스 확인. 다시 열어 소개 링크 선택 후 메뉴 닫힘, #about, about 포커스 확인.
- 앵커 이동 후 헤더 scrolled와 상단 버튼 표시. About의 보이는 reveal 요소는 visible이었다. 모든 reveal이 동시에 보여야 한다고 오판하지 않았다.
- 상단 버튼은 브랜드 포커스와 버튼 숨김을 확인했다. smooth 이동 중간의 scrollY는 최종값으로 기록하지 않았고 전달 전 root 페이지의 scrollY=0을 확인했다.
- 빈 문의 제출은 이름/이메일/메시지 근처의 3오류와 첫 필드 포커스. 잘못된 이메일은 해당 오류만 남겼고 정상 수정 후 오류 0 및 "이 데모에서는 메시지가 실제로 전송되지 않습니다" 성공 안내 확인.
- 폼은 외부 전송 코드가 없고 페이지 새로고침 없이 확인한다. 시험 값은 제거한 뒤 root 페이지를 다시 열어 3필드 모두 빈 값인 것을 확인했다.
- 해당 기능 시험의 console error/warn 로그는 `[]`. 모든 시점/브라우저의 무오류를 주장하지 않는다.

### 상태별 회귀 검증

`node --test tests/contact.test.cjs tests/projects.test.cjs tests/structure.test.cjs tests/ui.test.cjs`: 20 tests passed / 0 failed. 실제 공개 JS가 로컬 테스트 대상과 동일함을 별도로 검증했다. 60/300/0.2 경계, 저장 차단/Observer 미지원/reduced-motion, API empty/error/403/429/네트워크/중복 재시도/페이지네이션/HTML·URL 안전성, 폼 공백·부분 입력·반복·자동 완성을 검사했다.

공개 브라우저에서는 loading→실 API success를 확인했다. 실패·빈 목록·403·재시도는 동일 소스의 로컬 제어 응답/자동 시험 근거이며 공개 API를 고의로 실패시키거나 요청 제한을 소모해 재현하지 않았다. 이는 공개 화면에서 모든 실패 상태를 다시 확인했다는 뜻이 아니다.

## 최종 화면

공개 URL의 실제 앱 브라우저 캡처이며 Chrome 캡처가 아니다.

- [desktop.png](screenshots/desktop.png): 1280×900 설정, 실제 PNG 1265×889, Hero 라이트.
- [mobile.png](screenshots/mobile.png): 360×780 설정, 실제 PNG 345×748, Hero 라이트.
- [dark.png](screenshots/dark.png): 1280×900 설정, 실제 PNG 1265×889, Hero 다크.

캡처 API는 JPEG 바이트를 반환해 최종 산출물은 sips로 PNG 형식만 변환했다. 내용을 재작성/보정/AI 생성하지 않았다. 모바일의 초기 viewport 변경 직후 캡처는 이전 프레임이 축소돼 다시 캡처했고 최종 파일을 시각 검사했다. 기존 로컬 캡처와 같은 파일명을 갱신했으며 과거 로컬 시험 이력과 현재 공개 캡처를 구분한다.

## 재배포와 한계

`scripts/export-pages.cjs`는 `mktemp -d /private/tmp/hyj-pages.XXXXXX`로 만든 디렉터리에 허용 파일만 복사하고 공개용 README를 생성한다. 검증된 위 Pages URL을 두 번째 인자로 전달하면 최종 화면 3장을 포함한다. 기존 배포 브랜치의 최신 상태를 받아 같은 선별 파일의 변경만 일반 commit/push한다. 로컬 develop 전체를 push하거나 force push하지 않는다.

Chrome 153.0.8010.36의 기능·반응형·콘솔 최종 시험은 이전 UI 제어 중단으로 미완료다. 기존 검증 Task는 07:20:12 UTC에 web-user가 확인 후 DONE으로 확정했으나 그 사용자 확정을 Chrome 자동 시험 성공으로 해석하지 않는다. 이번 공개 배포 검증은 앱 브라우저 근거다.

실제 이메일 전송, 원 프로젝트 성과 재벤치마크, 전화번호/원본 이력서 공개, 내부 서버 수리 및 장비 제어는 범위에 포함하지 않았다.
