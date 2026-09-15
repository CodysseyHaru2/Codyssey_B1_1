# 결정

- 외부 라이브러리 없이 독립 IIFE와 작은 상태/렌더 함수로 구현했다.
- 테마 저장 실패는 화면 전환을 막지 않고, 움직임 축소 및 Observer 미지원에서는 콘텐츠를 숨기지 않는다.
- innerHTML은 고정된 두 SVG 아이콘에만 사용한다. 외부 데이터는 이 Task에 없다.
- scroll은 passive 이벤트와 requestAnimationFrame으로 렌더를 제한한다.
