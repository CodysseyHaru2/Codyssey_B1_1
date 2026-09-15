# 결정

- 대표작 보강은 정확한 이름 일치의 공개 API 객체에만 적용한다. 비공개 프로젝트 메타데이터와 가짜 스타를 만들지 않는다.
- 템플릿 리터럴/map/구조분해를 사용하되 모든 외부 표시값과 URL 속성을 escape한다. 위험한 프로토콜·자격증명·내부 IP·tailnet 장비 주소는 링크로 만들지 않는다.
- 이름 조회는 Object.hasOwn으로 prototype 키 충돌을 피한다. 오류 후 재시도는 기존 DOM을 교체하고 요청 중 호출은 무시한다.
- 홈페이지는 유효한 공개 http/https 주소만 표시한다. 독립 서비스 정상 운영을 보장하는 문구는 쓰지 않는다.
- GitHub 공식 저장소 API 문서를 확인했다: https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user
