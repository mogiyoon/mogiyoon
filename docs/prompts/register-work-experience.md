# 경력(Work Experience) 등록 양식 프롬프트

포트폴리오 사이트의 **경력** 섹션에 새 회사(경력) 또는 기존 회사 아래 새 프로젝트를 등록할 때 쓰는 재사용 프롬프트다. 개별 프로젝트의 개발 사항(highlights) 추출은 [extract-resume-highlights.md](./extract-resume-highlights.md) 가 담당하고, 이 프롬프트는 **등록에 필요한 파일 3개의 뼈대 JSON** 을 만든다.

## 수정 대상 파일

| 파일 | 역할 |
|---|---|
| `public/data/introduction.json` | `workExperience[]` 에 `{ id, projects: [{ id, tech }] }` 구조 등록 |
| `public/locales/ko/introduction.json` | `work.{WORK_ID}` 한국어 텍스트 |
| `public/locales/en/introduction.json` | `work.{WORK_ID}` 영어 텍스트 |

경력 id 는 위 3개 파일에만 존재한다. 다른 파일(코드, resume-profile 등)에는 등록할 곳이 없다.

## 사용법

1. 아래 `---` 사이 블록을 통째로 복사해 붙여넣고, 상단 변수를 채운다.
2. 산출된 JSON 3개를 각 파일에 병합한다.
3. highlights 를 채우려면 대상 프로젝트 레포에서 `extract-resume-highlights.md` (TYPE=work) 를 실행해 `projects.{PROJECT_ID}` 에 병합한다.

---

## 프롬프트 본문 (복사해서 사용)

```
# 역할

너는 mogiyoon 포트폴리오 사이트의 경력 데이터를 등록하는 어시스턴트다.
아래 입력 변수만으로 파일 3개에 병합할 JSON 조각을 만든다. 입력에 없는 사실을 지어내지 않는다.

# 입력 변수

- MODE: <newWork | newProject>       # newWork = 새 회사 등록, newProject = 기존 회사에 프로젝트 추가
- WORK_ID: <camelCase id, 예: deeptrade / gamaSchool>
- WORK_TITLE_KO: <회사명 한국어, MODE=newWork 일 때만>
- WORK_TITLE_EN: <회사명 영어, MODE=newWork 일 때만>
- WORK_PERIOD: <YYYY.MM ~ YYYY.MM 또는 "YYYY.MM ~ 재직중", MODE=newWork 일 때만>
- WORK_POSITION: <(선택) 회사 단위 직책. 프로젝트가 없는 경력(예: 교사)일 때만 사용>
- PROJECTS: <프로젝트 목록. 각 항목: id(camelCase), 이름, 담당 포지션, 기간, 기술 스택 배열.
             프로젝트가 없는 경력이면 "없음">

# 작성 규칙

- 어투: 공식적·기술적. 문장 종결은 "~함", "~됨", "~임". 구어체·감탄 금지.
- id 는 camelCase (예: crawlMonitorWeb). 한 번 정하면 3개 파일에서 동일하게 사용한다.
- 기간 표기:
  - ko: "YYYY.MM ~ YYYY.MM", 진행 중이면 "YYYY.MM ~" 또는 "YYYY.MM ~ 재직중"
  - en: "Mon YYYY – Mon YYYY" (en dash), 진행 중이면 "Mon YYYY –", 재직중이면 "Mon YYYY – Present"
- 프로젝트 name 은 "프로젝트명 (대표 기술)" 형태 가능 (예: "모니터링 봇 (Python)").
- en 은 직역이 아니라 영어 이력서 관용 표기로 쓴다 (예: "웹 애플리케이션 단독 개발" → "Sole Developer").
- highlights / aiHighlights 는 빈 배열로 둔다. 채우는 것은 extract-resume-highlights 프롬프트의 몫이다.
- tech 배열은 화면에 칩으로 나열되므로 고유명사 정확한 표기를 쓴다 (예: "Next.js", "TypeScript").

# 출력 (설명 문장 없이 JSON 블록 3개만, 병합 위치 주석과 함께)

## 1. public/data/introduction.json — workExperience[] 에 병합

MODE=newWork 이면 배열에 추가할 객체 하나:
{
  "id": "{WORK_ID}",
  "projects": [
    { "id": "{PROJECT_ID}", "tech": ["...", "..."] }
  ]
}
프로젝트가 없으면 "projects": [] 로 둔다.
MODE=newProject 이면 기존 workExperience[].projects 에 추가할 { id, tech } 객체만 출력한다.

## 2. public/locales/ko/introduction.json — work.{WORK_ID} 에 병합

MODE=newWork:
{
  "{WORK_ID}": {
    "title": "회사명",
    "period": "YYYY.MM ~ 재직중",
    "position": "(선택) 회사 단위 직책 — 프로젝트가 없을 때만",
    "projects": {
      "{PROJECT_ID}": {
        "name": "프로젝트명 (대표 기술)",
        "position": "담당 포지션",
        "period": "YYYY.MM ~",
        "highlights": [],
        "aiHighlights": []
      }
    }
  }
}
프로젝트가 없으면 "projects": {} 로 두고 position 을 회사 레벨에 쓴다.
MODE=newProject 이면 projects 아래에 추가할 "{PROJECT_ID}": { ... } 조각만 출력한다.

## 3. public/locales/en/introduction.json — work.{WORK_ID} 에 병합

구조는 2와 동일하되 모든 텍스트를 영어 이력서 표기로 쓴다.

# 금지 사항

- 입력에 없는 기간·직책·기술 스택을 만들어내지 않는다. 비어 있으면 "확인 필요: X" 로 표시한다.
- highlights 를 임의로 채우지 않는다.
- ko / en 의 키 구조가 달라지게 만들지 않는다.
```

---

## 병합 시 체크리스트

- [ ] `WORK_ID` / `PROJECT_ID` 가 3개 파일에서 완전히 동일한가 (camelCase)
- [ ] `public/data/introduction.json` 의 `projects[].id` 와 locales 의 `projects.{id}` 키가 1:1 대응하는가
- [ ] ko / en 두 파일의 키 구조와 항목 순서가 일치하는가
- [ ] en 기간 표기가 en dash(–) 인가 ("Mar 2026 –" 형식)
- [ ] 프로젝트가 없는 경력은 `projects: []` / `projects: {}` + 회사 레벨 `position` 인가 (gamaSchool 참고)
- [ ] highlights 를 채웠다면 extract-resume-highlights 의 근거표를 거쳤는가
