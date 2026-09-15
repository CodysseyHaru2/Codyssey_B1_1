# 결정

- 공개 API 호출을 반복하지 않고 localhost QA 서버에서 메모리로 endpoint만 바꿔 시험했다. 실제 웹 소스에는 fixture/우회 코드를 넣지 않는다.
- 로컬/대체 응답/실 API/Chrome/공개 배포의 검증 증거를 구분한다. 미검증을 PASS로 보정하지 않는다.
- Sites의 화면 설계 원칙을 참고했으나 사용자가 지정한 순수 웹 기술/GitHub Pages 미션 조건이 우선이므로 Sites 호스팅이나 프레임워크 scaffolding을 적용하지 않는다.
- 작업 기록은 Loom CLI로 관리하고 공개 Pages 자산에서 .loom/PDF/log를 제외할 필요를 문서화한다. 공개 Git 기록 범위도 사용자 선택 없이 확정하지 않는다.
