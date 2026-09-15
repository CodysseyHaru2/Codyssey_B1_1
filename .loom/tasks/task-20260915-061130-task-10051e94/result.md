# 결과

- js/contact.js를 연결하고 JavaScript 초기화 후 제출 버튼을 활성화했다.
- input/submit에서 값·오류·제출 상태를 갱신하고 renderField/renderStatus로 필드 근처 오류, aria-invalid, live 상태를 렌더한다. 공백 및 이메일 형식을 확인하고 preventDefault 후 첫 오류에 포커스한다.
- Node 테스트 4개 통과: 초기/빈 값/공백/부분 입력/형식 오류/수정/정상·반복 제출/자동 완성. 입력은 외부 전송이나 저장 없이 확인만 한다.
- 앱 브라우저에서 빈 제출의 3오류와 첫 필드 포커스, 잘못된 이메일, 수정 후 명확한 데모 성공을 확인했다. error/warn 로그는 비어 있었다.
- 이 검증 중 GitHub API 실 요청이 정상 응답해 공개 저장소 10개와 TinyPilot 대표 카드, 없는 Loom/DeepQuest 안내를 실제 브라우저에서 확인했다. 이전 요청 제한 후 정상 성공 상태도 확인됐다.
- 다음은 전체 요구사항·README·화면 기록이며, 공개 저장소/배포 범위 선택 전 push/배포는 하지 않는다.
