# 공통 프리미티브 사용 규칙

기능 추가 / 수정 전 반드시 `docs/conventions/shared-primitives.md` 를 읽을 것. 인라인 `useEffect` / `useState` / `className` 조합을 새로 작성하기 전에, 위 가이드에 동일하거나 유사한 패턴이 이미 프리미티브로 존재하는지 확인할 것.

@docs/conventions/shared-primitives.md

추출 완료된 프리미티브:

- Hooks: `useDisclosure`, `useBodyScrollLock`, `useEscapeKey`, `useClickOutside`, `useCopyToClipboardWithToast`, `useToggleSet`, `useFetchJson`, `useMediaQuery`
- Components: `Chip`, `ModalShell`, `FlippableCard`, `RotatingChevron`, `BulletList`, `InfoCell`, `ExternalLink`, `TimelineStep` (모두 `src/components/primitives/`)
- Utils: `placeholders.ts` (`PLACEHOLDER_*` 상수), `imageFallback.ts` (`createImageFallbackHandler`), `formatIndex.ts` (`formatIndex`), `motionPresets.ts` (`collapseVerticalPreset`), `i18nArray.ts` (`fetchI18nArray`)
- Tokens (design-tokens.ts 추가분): `easings.{projectCard, toast, standard}`, `TOAST_VISIBLE_MS`

신규 프리미티브 제안은 동일/유사 패턴이 2곳 이상에서 필요해질 때만 한다. Deferred 목록 (D-001 ~ D-013) 에 있는 항목은 오케스트레이터가 후속 처리하므로 직접 추출하지 말 것.

# Branch Management Rules

- feature 브랜치는 반드시 `develop` 브랜치에서 분기한다 (`git checkout develop && git checkout -b feat/...`)
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

### techStack 등재 기준 (2026.08 구직 사이트 수요 조사 기반)

`projects-list.json`의 techStack은 프로젝트 카드와 기술 스택 필터에 노출되므로, **한국 구직 사이트(사람인·잡코리아·원티드·점핏) 채용공고에서 자격요건/우대사항 키워드로 실제 검색되는 스택만** 등재한다. 상세 페이지(`public/data/projects/{id}.json`의 overview.techStack)에는 전체 스택을 기재해도 된다.

- 등재 O (채용 키워드로 다수 등장 확인됨): React, Next.js, TypeScript, JavaScript, Redux, React Native, Flutter, FastAPI, Nest.js, PostgreSQL, AWS, Unity, Firebase, Rust, Provider
- 등재 O — 예외 유지 (채용 키워드는 아니지만 프로젝트 정체성·차별성을 드러내는 도메인/도구 키워드): claude CLI, MCP, npm Package, Chrome Extension, AR/VR, ffmpeg, Google Vision API
- 등재 X (채용 키워드로 거의/전혀 쓰이지 않음 — 상위 개념으로 대체됨): SQLAlchemy, SQLite, yfinance, APScheduler, Chart.js, Tauri, @xyflow/react, Canvas2D, tsup, Manifest V3, Material Design
- 목록에 없는 새 스택은 "채용공고 자격요건에 해당 키워드가 명시된 공고가 다수 존재하는가"를 기준으로 판단한다. 특정 라이브러리/도구 명칭은 대체로 언어·프레임워크(예: Python, React) 수준으로만 공고에 기재되므로 등재하지 않되, 프로젝트의 정체성을 대표하는 키워드는 예외로 등재할 수 있다.

## 4. 프로젝트 카드 번역 등록
- `public/locales/ko/projects.json` — 한국어 title, subtitle, overview.projectType 추가
- `public/locales/en/projects.json` — 영어 title, subtitle, overview.projectType 추가

## 5. 이미지 추가
- `public/images/{projectName}/Icon.png` — 프로젝트 썸네일
- `public/images/{projectName}/appGif.gif` — 데모 GIF
- `public/images/{projectName}/og.png` — 공유 미리보기(og:image)용 1200x630 PNG. `scripts/generate-og-images.sh` 실행으로 GIF 프레임에서 생성하고, 프로젝트 JSON의 `ogImage` 필드에 경로를 적는다 (GIF·SVG는 크롤러가 못 쓰므로 og:image로 쓰지 않음)
- `public/images/{projectName}/overview/` — 상세 페이지용 이미지 (선택)

## 5-1. 대표 프로젝트 지정 (선택)
- `projects-list.json` 항목에 `"featured": N` (1부터 순위) 을 주면 프로젝트 탭 상단 "대표 프로젝트" 행에 배치됨. 2~5개 유지 (Josh Comeau, *Building an Effective Dev Portfolio* 기준). 현재: recho(1) · seoul-meari(2) · react-stable-timeline(3)
- 프로젝트 상세 라우트(`/project/{id}`)는 `projects-list.json` 기준으로 빌드 시 자동 프리렌더 + sitemap.xml 에 포함되므로 별도 등록 불필요

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

# Claude 협업 정보 프로토콜 (claudeInfo)

Claude를 활용하여 개발한 프로젝트에 협업 방식을 기록하기 위한 양식.

## 타입 정의 (`src/types/index.ts`)

```ts
interface ClaudeInfo {
  method: 'direct' | 'harness' | 'orchestrator';
  summary: string;        // i18n key — 한 줄 요약
  agents?: ClaudeAgent[]; // 하네스 에이전트 목록 (direct에서는 생략)
  flow?: string[];        // i18n keys — 실행 흐름 단계 (direct에서는 생략)
  details?: string;       // i18n key — 추가 설명
}
```

## 적용 위치

### 1. `projects-list.json` (카드 뱃지 표시용)
```json
{
  "id": "project-id",
  "claudeInfo": {
    "method": "direct",
    "summary": "project-id.claudeInfo.summary"
  }
}
```

### 2. `projects/{project-id}.json` (상세 페이지용)
```json
{
  "claudeInfo": {
    "method": "direct",
    "summary": "project-id.claudeInfo.summary",
    "details": "project-id.claudeInfo.details"
  }
}
```

### 3. i18n 번역 파일 (`project-{project-id}.json`)
```json
{
  "claudeInfo": {
    "summary": "한 줄 요약",
    "details": "상세 설명"
  }
}
```

## method별 사용 예시

### direct — 단일 Claude 직접 사용
```json
{
  "method": "direct",
  "summary": "i18n-key",
  "details": "i18n-key"
}
```

### harness — 멀티에이전트 하네스 사용
```json
{
  "method": "harness",
  "summary": "i18n-key",
  "agents": [
    { "name": "Architect", "role": "i18n-key", "permissions": "readonly" },
    { "name": "Coder", "role": "i18n-key", "permissions": "bypassPermissions" },
    { "name": "Debugger", "role": "i18n-key", "permissions": "readonly" },
    { "name": "Reviewer", "role": "i18n-key", "permissions": "readonly" }
  ],
  "flow": ["i18n-key-step1", "i18n-key-step2", "i18n-key-step3"],
  "details": "i18n-key"
}
```
