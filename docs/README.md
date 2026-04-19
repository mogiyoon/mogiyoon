# Resume Docs — mogiyoon

이력서 관점으로 포트폴리오의 내용을 정리한 문서 트리임. UI·컴포넌트 구조가 아닌, 프로젝트·경력·스킬의 **내용**을 중심으로 정리됨.

## 문서 트리

```
docs/
├── README.md                     ← 현재 파일
├── profile/
│   ├── README.md                 ← 프로필 인덱서
│   ├── work-experience.md        ← 경력
│   ├── education.md              ← 학력
│   ├── awards.md                 ← 수상
│   ├── certificates.md           ← 자격증
│   └── skills.md                 ← 기술 스택
└── projects/
    ├── README.md                 ← 프로젝트 인덱서
    ├── seoul-meari.md            ← 서울 메아리 (2025 서울 AI 해커톤 대상)
    ├── recho.md                  ← Recho
    ├── test-maker.md             ← Test Maker
    ├── mrnsg.md                  ← React Native Simple Grid
    ├── teacher-test.md           ← Tea Time
    ├── boj-snippets.md           ← BOJ Snippets (Claude 협업)
    └── preparing.md              ← 준비 중 프로젝트
```

## 섹션 바로가기

- 프로필: [profile/README.md](profile/README.md)
- 프로젝트: [projects/README.md](projects/README.md)

## 운용 규칙

- 본 문서는 `public/data/**` 및 `public/locales/ko/**`를 1차 소스로 함. 원문이 갱신되면 본 문서도 함께 갱신되어야 함.
- 자동 리마인더: `public/data/**/*.json` 또는 `public/locales/**/*.json` 이 수정되는 경우 `.claude/settings.json`의 hook이 동기화 필요 여부를 알림.
- 어투: CLAUDE.md §6 어투 가이드를 따름. "~함/~됨/~임" 체로 통일, 구어체·감정 표현 금지.
- 파일 분할 기준: 단일 문서가 500줄을 초과하거나 섹션이 4개 이상 구분되는 시점에 하위 디렉토리로 분할함.

## 데이터 소스 대응표

| 문서 | 1차 소스 |
|---|---|
| profile/work-experience.md | `public/data/introduction.json` + `public/locales/ko/introduction.json#work` |
| profile/education.md | `public/locales/ko/introduction.json#education` |
| profile/awards.md | `public/locales/ko/introduction.json#awards` |
| profile/certificates.md | `public/locales/ko/introduction.json#certificate` |
| profile/skills.md | `public/data/introduction.json#skills` + `public/locales/ko/introduction.json#skills` |
| projects/README.md | `public/data/projects-list.json` + `public/locales/ko/projects.json` |
| projects/{id}.md | `public/data/projects/{id}.json` + `public/locales/ko/projects/project-{id}.json` |
| projects/preparing.md | `public/data/preparing-projects-list.json` + `public/locales/ko/prepareProjects.json` |
