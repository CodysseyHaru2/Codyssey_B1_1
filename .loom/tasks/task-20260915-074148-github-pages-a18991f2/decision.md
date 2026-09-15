# 결정

- 사용자의 “오너 바꿨더니 ... 다시 배포해”는 현재 에이전트의 foreground 재배포 승인으로 기록했다. 기존 완료 Task를 재실행하지 않고 같은 사이트 목표의 후속 Task 8을 추가했다.
- 실제 owner/repository·PUBLIC·ADMIN을 원격에서 확인하고 새 Pages html_url을 사용했다. 소유자나 저장소 공개 범위를 다시 변경하지 않았다.
- 기존 Pages 설정은 정확하므로 삭제·재생성하지 않았다. 기존 배포 브랜치를 fetch/fast-forward하고 공개 README/새 화면 3장만 일반 push하여 재게시했다.
- 소유자 하드코딩 때문에 배포 도구가 새 URL을 거부하므로 실제 repository 인자를 받아 기대 Pages URL과 공개 소스 링크를 동일한 값으로 계산하도록 최소 보완했다.
- 로컬 develop의 코드·문서·Loom 기록은 로컬에 함께 commit한다. 공개 배포는 기존 선별 브랜치만 사용하고 기존 main/develop의 사용자 원격 변경을 보존한다.
- 이전 배포/Chrome 검증 이력을 새 시험 결과로 바꾸지 않고 새 주소 확인과 API 목록 11개를 별도 기록했다.
