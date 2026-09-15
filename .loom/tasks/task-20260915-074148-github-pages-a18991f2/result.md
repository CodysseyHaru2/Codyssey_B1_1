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
