# Branch Management Rules

- 기능별로 feature 브랜치를 생성한다 (예: `feat/add-boj-snippets`)
- 커밋 명령 시 develop 브랜치로 Pull Request를 생성하는 것을 원칙으로 한다
- PR 대상 브랜치: `develop`

# 새 프로젝트 등록 절차

포트폴리오에 새 프로젝트를 추가할 때 아래 파일들을 모두 수정/생성해야 한다.

## 1. 프로젝트 데이터 파일 생성
- `public/data/projects/{project-id}.json`
- 기존 프로젝트(예: `mrnsg.json`, `seoul-meari.json`)를 참고하여 작성
- 주요 섹션: overview, summaries(development/troubleshooting/results/blank), features, screenshots, developmentProcess, license

## 2. 번역 파일 생성 (i18n)
- `public/locales/ko/projects/project-{project-id}.json` — 한국어
- `public/locales/en/projects/project-{project-id}.json` — 영어
- 프로젝트 데이터 파일의 i18n 키에 대응하는 실제 텍스트를 작성

## 3. 프로젝트 목록에 등록
- `public/data/projects-list.json` — 배열에 항목 추가 (id, title, subtitle, projectType, screenshots, techStack)

## 4. 프로젝트 카드 번역 등록
- `public/locales/ko/projects.json` — 한국어 title, subtitle, overview.projectType 추가
- `public/locales/en/projects.json` — 영어 title, subtitle, overview.projectType 추가

## 5. 이미지 추가
- `public/images/{projectName}/Icon.png` — 프로젝트 썸네일
- `public/images/{projectName}/appGif.gif` — 데모 GIF
- `public/images/{projectName}/overview/` — 상세 페이지용 이미지 (선택)

## 6. 어투 가이드
- 블로그 스타일의 구어체가 아닌 **공식적·기술적 어투**를 사용한다
- 문장 종결은 "~함", "~됨", "~임" 체로 통일한다
- 구어체/감정 표현은 사용하지 않는다

| 사용하지 않는 표현 | 올바른 표현 |
|---|---|
| ~했습니다, ~입니다 | ~함, ~됨, ~임 |
| 빡세다, 귀찮다, 아깝다 | 엄격함, 비효율적임 |
| 가짜 UI, 예쁜 드롭다운 | 커스텀 UI, 커스텀 드롭다운 |
| 삽질을 했다, 발목을 잡았다 | 다수의 시도를 진행함, 제약 사항이 존재함 |
| 3번 실패하고 4번째에 성공 | 다수의 시도 끝에 해결 |
