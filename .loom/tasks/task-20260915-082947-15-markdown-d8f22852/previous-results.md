# Previous Results

6 older recorded result(s) were omitted. Promote durable context to Job Notes or explicit Context References.

## 7. 공개 범위 확인 후 GitHub Pages 배포하고 실제 제출 URL 검증

# 결과

선택한 기존 저장소에 소개 페이지를 GitHub Pages로 게시했다.

- 실제 공개 URL: https://codysseyharu2.github.io/Codyssey_B1_1/
- 저장소: https://github.com/CodysseyHaru2/Codyssey_B1_1
- 공개 소스: https://github.com/CodysseyHaru2/Codyssey_B1_1/tree/codex/portfolio-pages
- 최초 게시 69600e80d99b0d7b58d113ffa114da6fcb6fede5, 최종 제출 ed53f3b4a3ec12ec44436a36a2080a46125cba97.
- README, docs/deployment.md, docs/verification.md 및 실제 공개 PNG 화면 3장을 갱신했다. scripts/export-pages.cjs와 .nojekyll을 추가해 공개 자산만 선별했다.

## 검증 결과

- 실제 외부 HTTPS의 HTML/CSS/JS/SVG 9개 HTTP 200 및 로컬 바이트 일치. 공개 소스 HTTP 200, .loom/project.md와 원본 이력서 PDF 경로 HTTP 404.
- 앱 브라우저 공개 페이지 loading→실 API success, 저장소 10개/TinyPilot 대표 카드와 Loom·DeepQuest 누락 안내 확인.
- 실 카드 10개 상태에서 360/767/768/1023/1024/1280의 문서 넘침/카드 내부 넘침/깨진 이미지 없음. 767↔768 메뉴 경계 정상.
- 테마 전환/새로고침 유지/라이트 복원, 모바일 메뉴/Escape/포커스/앵커 닫힘, 헤더 배경/상단/등장 확인.
- 문의 빈 값 3오류/첫 필드 포커스/이메일 오류/정상 수정의 명확한 전송 없는 데모 성공 확인. 시험 값을 지우고 root의 scrollY=0 및 빈 필드 확인. 기능 시험 console error/warn=[].
- Node 내장 회귀 테스트 20 tests passed / 0 failed. 공개 소스와 동일한 로컬 JS로 오류·빈 상태·403·429·재시도·60/300/0.2 경계 등 검증. 공개 API를 고의로 실패시킨 결과는 아니다.
- 최종 공개 캡처 시각 검사 및 실제 PNG 형식/크기 확인: desktop/dark 1265×889, mobile 345×748. viewport reset 및 실제 공개 페이지 전달 탭 보존.
- git diff --check, 배포 도구 node --check 통과. Pages 설정 HTTPS enforced=true, legacy source=codex/portfolio-pages:/.
- 최종 ed53f3b4a3ec12ec44436a36a2080a46125cba97의 Pages build=built, error=null 확인. 공개 README와 PNG 3장 HTTP 200/배포 파일 바이트 일치 및 image/png MIME 확인. 최종 공개 tree는 허용 파일 14개뿐이다.

## 공개 안전성과 남은 한계

기존 main SHA dca986bef86422b386b83a170532ec961ff6c372는 그대로다. develop의 Git 이력, PDF, .loom 기록을 push하지 않았다. 공개 브랜치에는 허용 자산·공개 README·화면만 포함한다. force push나 저장소 공개 범위 변경을 하지 않았다.

Chrome 기능·반응형·콘솔 최종 시험은 미완료임을 유지했다. 이전 검증 Task는 별도 web-user의 확인으로 DONE 확정됐으므로 사용자 결정을 변경하지 않았다. 이번 확인은 앱 브라우저이며 Chrome PASS로 기록하지 않는다.

사용자는 공개 URL에서 소개 페이지를 바로 열 수 있다. 안정된 Chrome 시험은 남은 품질 확인이며 실제 메시지 전송/운영 장비 접근/원 프로젝트 성과 재측정은 범위 밖이다.

## 8. 소유자 이전 후 GitHub Pages 주소·배포 설정 복구

# 결과

사용자의 소유자 변경 후 재배포 요청을 실행했다. 새 공개 URL은 https://develsvai.github.io/Codyssey_B1_1/ 이며 실제 저장소는 https://github.com/develsvai/Codyssey_B1_1 이다. 기존 codex/portfolio-pages 브랜치에 bfa9e4774a631192615265cfc8dd0bc11eb8cab4를 일반 push해 재게시했다.

기존 페이지 파일과 Pages source 설정은 남아 있었다. 이전 소유자 URL은 404, 새 URL은 초기 조회부터 200이어서 파일 유실 대신 주소 변경과 오래된 제출 링크를 확인했다. 로컬 원격·README·공개 README·배포 기록·도구의 소유자 의존성을 갱신했다. 배포 도구는 실제 owner/repository 인자로 저장소 링크와 기대 Pages URL을 함께 계산한다.

## 검증 결과

- 최종 Pages build=built, commit=bfa9e4774a631192615265cfc8dd0bc11eb8cab4, error.message=null, updated_at=2026-09-15T07:44:35Z.
- 새 주소의 9개 HTML/CSS/JS/SVG는 비인증 HTTP 200이며 로컬 소스와 바이트 단위로 일치했다. 최종 README/PNG 3장도 HTTP 200/배포 파일 일치, PNG MIME=image/png. 공개 소스 URL HTTP 200.
- 배포 브랜치는 허용 파일 14개만 포함한다. .loom/project.md와 원본 이력서 PDF 경로는 Pages에서 404. 기존 main=2c0f7981f19f265029cd0cf4f826ffef53629b59 및 develop=95c090796f67c6ab38abe265b3021e115785f28b의 원격 SHA를 그대로 보존했다.
- 새 주소의 앱 브라우저에서 실 API 저장소 11개, TinyPilot 및 Loom/DeepQuest 누락 안내 확인. 360/768/1280px에서 문서·카드 내부 넘침 및 깨진 이미지 0.
- 다크 클릭 후 새로고침 복원/라이트 복원, 모바일 메뉴 열기 및 Escape 닫힘/포커스, 빈 폼 3오류/첫 필드 포커스/정상 입력의 전송 없는 데모 성공 확인. 해당 시험 console error/warn=[]. root로 재이동해 시험 값을 제거했고 viewport reset했다.
- Node 내장 회귀 테스트 20 tests passed / 0 failed. 배포 도구 node --check 및 git diff --check 통과. 공개 앱 코드 자체는 변경하지 않았다.
- 실제 새 주소 캡처 3장을 시각 검사했고 PNG desktop/dark=1265×889, mobile=345×748 확인. 캡처 JPEG는 인코딩만 PNG로 변환했다.

## 한계와 다음 행동

사용자는 새 develsvai Pages 주소를 사용해야 한다. 이전 소유자 Pages 주소의 자동 리디렉션을 제공하지 않는 GitHub 계약을 기록했다. 기존 계정에 새 저장소나 우회 서비스를 만들지 않았다.

PDF·Loom 기록·전체 개발 브랜치를 배포에 추가하지 않았고 기존 사용자 브랜치를 강제 변경하지 않았다. Chrome 최종 기능·반응형·콘솔 미검증과 문의 폼 실제 전송 없음, API 요청 제한이라는 한계는 유지한다. 이번 복구 증거는 앱 브라우저와 HTTPS 자산 검사이며 Chrome 시험이라고 표현하지 않는다.
