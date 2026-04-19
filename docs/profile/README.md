# Profile

개인 이력 정보 인덱서. 각 섹션은 별도 파일로 분리됨.

## 문서

- [work-experience.md](work-experience.md) — 경력 (재직 이력 + 프로젝트별 highlights)
- [education.md](education.md) — 학력
- [awards.md](awards.md) — 수상 경력
- [certificates.md](certificates.md) — 자격증
- [skills.md](skills.md) — 기술 스택

## 요약

| 구분 | 내용 |
|---|---|
| 현재 소속 | 딥트레이드 테크놀러지스 (2025.09 ~ 재직 중, 프론트엔드 개발자) |
| 이전 이력 | 가마초등학교 담임교사 (2023.03 ~ 2025.02) |
| 재학 | 한국방송통신대학교 컴퓨터과학과 (2025.03 ~) |
| 학사 | 제주대학교 초등교육학과 (2019.03 ~ 2023.02) |
| 대표 수상 | 서울시 AI 해커톤 대상(서울특별시장상, 2025.10) |
| 주요 이수 | 크래프톤 정글 교육 과정(2025.03 ~ 2025.07) |

## 데이터 소스

- `public/data/introduction.json` — 메타 구조 (id·프로젝트 id·skill 분류)
- `public/locales/ko/introduction.json` — 실제 텍스트 (제목·기간·설명·highlights)

**주의**: 데이터 파일에는 id·skill item만 존재하며, 제목·기간·설명 등 실제 텍스트는 locale에만 존재함. MD 갱신 시 locale 파일을 1차 소스로 확인할 것.
