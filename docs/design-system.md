# Mogiyoon Design System

이 문서는 mogiyoon 포트폴리오의 디자인 토큰을 어떻게 정의하고 사용하는지를 정리한 가이드임.

---

## 개요

디자인 시스템은 다음 세 파일로 구성되며, 각 파일의 역할은 명확히 분리되어 있음.

| 파일 | 역할 | 비고 |
|---|---|---|
| `src/design-tokens.ts` | **단일 진실 소스 (Single Source of Truth)** | 모든 색상/폰트/간격/반지름/그림자/애니메이션 값이 정의됨 |
| `tailwind.config.ts` | **Tailwind 클래스 노출** | `design-tokens.ts`를 import하여 `theme.extend.*` 형태로 클래스 생성 |
| `design-preview.html` | **시각 카탈로그** | 서버 없이 브라우저에서 열어 토큰을 시각적으로 확인 |

### 절대 규칙

1. **새 토큰을 추가할 때는 세 파일을 모두 업데이트해야 함.** 누락 시 디자인 일관성이 깨짐.
2. `src/design-tokens.ts`가 변경되면 `tailwind.config.ts`와 `design-preview.html`이 동기화되어 있는지 확인할 것.
3. 컴포넌트 코드는 토큰을 참조하거나 토큰에서 파생된 Tailwind 클래스를 사용해야 함. 임의 픽셀 값(`shadow-[7px_7px_...]`, `rounded-[1.4rem]` 등)은 가급적 토큰화함.

---

## 토큰 카테고리

### Colors (`colors`)

| 그룹 | 키 | 사용처 |
|---|---|---|
| `background.*` | white, slate50, slate100, slate200 | 페이지/카드 배경 |
| `text.*` | primary, strong, secondary, meta, tertiary, muted | 본문/제목/메타 텍스트 |
| `accent.*` | indigo50/100/500/600/700, violet400/500 | 브랜드 강조, CTA, 뱃지 |
| `border.*` | default, strong | 구분선, 카드 테두리 |

Tailwind 노출: `bg-surface`, `text-content`, `text-content-meta`, `bg-accent-500`, `border-line` 등.

### Typography (`fonts`)

| 키 | 폰트 | 사용처 |
|---|---|---|
| `body` | Noto Sans KR | 한글 본문 (기본) |
| `latin` | Inter | 영문 본문 |
| `display` | Caveat | 로고, 장식 헤딩만 |
| `mono` | source-code-pro 외 | 코드/수치 표시 |

Tailwind: `font-body`, `font-display`, `font-mono`, `font-latin`.

### Spacing (`spacing`)

| 키 | 값 | 사용처 |
|---|---|---|
| `section` | 5rem (80px) | 섹션 상단 패딩 (`pt-section`) |
| `hairline` | 4px | 미세 패딩 (ProfileSection 등) |
| `scrollViewport.half` | 52vh | PostSection 스크롤 스냅 (절반) |
| `scrollViewport.threeFifths` | 55vh | PostSection 스크롤 스냅 (60%) |
| `scrollViewport.full` | 65vh | PostSection 스크롤 스냅 (전체) |

Tailwind 노출: `p-section`, `p-hairline`, `m-scroll-viewport-three-fifths`, `p-scroll-viewport-half`, `p-scroll-viewport-full`.
(중첩 객체는 Tailwind 클래스로 노출되지 않으므로 평탄화한 키를 사용함.)

### Radii (`radii`)

세 그룹으로 구성됨.

| 그룹 | 키 | 값 | 용도 |
|---|---|---|---|
| Semantic | `card` | 0.75rem (12px) | 일반 카드 |
| Semantic | `modal` | 1rem (16px) | 모달 |
| Semantic | `pill` | 9999px | 칩, 둥근 버튼 |
| Generic | `md / lg / xl / 2xl / 3xl` | 6 / 8 / 12 / 16 / 24px | Tailwind 기본과 동일하게 미러링 |
| App-specific | `cardSoft28` | 1.75rem (28px) | EducationCard, ProjectFlipPreviewCard |
| App-specific | `cardChunky` | 3rem (48px) | PortfolioCard |
| App-specific | `paperEdge` | 1.4rem (22.4px) | ResumePreviewPage |
| App-specific | `paperEdgeLg` | 2rem (32px) | ResumePreviewPage |

Tailwind: `rounded-card`, `rounded-modal`, `rounded-card-soft-28`, `rounded-paper-edge-lg` 등.

### Shadows (`shadows`)

다섯 그룹으로 구성됨.

| 그룹 | 키 | 용도 |
|---|---|---|
| Generic | `sm / lg / xl / 2xl` | 일반 elevation (Tailwind 기본 미러) |
| Brand glow | `glowAccent` | 인디고 외부 + 흰색 내부 글로우 (Vibe 뱃지) |
| Brand glow | `glowAccentSm` | SVG 필터 그림자 (작은 글로우) |
| Brand glow | `glowAccentXs` | 옅은 글로우 |
| Decorative | `polaroidSm / Md / Lg` | 폴라로이드 사진 스타일 드롭 그림자 |
| Decorative | `starGlow` | 별 화이트 글로우 (ShootingStar) |
| Page-specific | `postCard` | 0 8px 24px / 0.28 alpha |
| Page-specific | `postCardLg` | 0 10px 30px / 0.35 alpha |
| Page-specific | `postWhiteGlow` | 흰색 글로우 (다크 배경 위) |
| Page-specific | `resumePaper` | 이력서 종이 그림자 |

Tailwind: `shadow-glow-accent`, `shadow-polaroid-lg`, `shadow-post-card`, `shadow-resume-paper` 등.

### Easings (functional, code-only)

| 키 | 값 | 사용처 |
|---|---|---|
| `toast` | `cubic-bezier(0.68, -0.55, 0.27, 1.55)` | toast-in-out (overshoot) |
| `standard` | `easeOut` | 일반 진입/퇴장 (page, list, content) |
| `projectCard` | spring(stiffness 400, damping 17) | chipHover, 마이크로 인터랙션 |

`design-tokens.ts`의 `animation.*` 객체에 분산되어 있음. 시각화가 어려우므로 `design-preview.html`에서는 코드 블록으로만 표시.

### Durations (`durations`)

| 키 | 값 | 용도 |
|---|---|---|
| `instant` | 100ms | press feedback |
| `micro` | 150ms | micro-interaction |
| `fast` | 200ms | quick hover, exit |
| `page` | 250ms | page transition |
| `item` | 280ms | list item 진입 (stagger) |
| `standard` | 300ms | 표준 hover, shadow |
| `flip` | 700ms | 카드 플립 (예외) |

`TOAST_VISIBLE_MS` (3000ms)는 토스트 노출 총 시간으로 별도 상수.

---

## 명명 규칙

세 파일은 표현 방식이 다르므로 서로 다른 케이스를 사용함.

| 위치 | 케이스 | 예시 |
|---|---|---|
| `src/design-tokens.ts` | `camelCase` | `glowAccent`, `cardSoft28`, `scrollViewport.threeFifths` |
| `tailwind.config.ts` 노출 클래스 | `kebab-case` | `shadow-glow-accent`, `rounded-card-soft-28`, `p-scroll-viewport-three-fifths` |
| `design-preview.html` CSS 변수 | `--kebab-case` (`--shadow-`, `--radius-`, `--spacing-` 접두) | `--shadow-glow-accent`, `--radius-card-soft-28` |

세 표현은 1:1 대응되어야 함.

---

## 새 토큰 추가 절차

신규 디자인 토큰이 필요하면 아래 3단계를 모두 수행함.

1. **`src/design-tokens.ts`** — 적절한 카테고리 객체에 `camelCase` 키로 추가. 주석으로 단위(px/rem)와 사용처를 명시.
2. **`tailwind.config.ts`** — 동일 토큰을 `theme.extend.*`에 `kebab-case` 키로 노출. import 누락 주의.
3. **`design-preview.html`** — `:root` 블록에 CSS 변수로 추가하고, 해당 카테고리 섹션에 시각 미리보기를 추가.

PR 시 위 세 파일이 같은 커밋에 포함되어 있어야 리뷰가 통과됨.

---

## 언제 토큰화할 것인가 (vs Arbitrary Value)

**토큰화 대상**:
- 동일하거나 유사한 값이 **2회 이상** 등장하는 경우
- 의미 있는 디자인 결정(브랜드 색, 종이 질감, 카드 모서리 등)을 표현하는 값
- 디자인 일관성을 위해 다른 컴포넌트에서도 재사용 가능성이 높은 값

**그대로 두는 대상**:
- 일회성 픽셀 미세 조정 (예: 특정 컴포넌트에서만 쓰이는 `top-[3px]`)
- 디버깅용 / 임시 값
- 외부 라이브러리 충돌 회피용 값

판단이 모호하면 토큰화하는 쪽이 안전함. 토큰은 추가 비용이 거의 없고 추후 일관성 변경이 쉬움.

---

## 관련 문서 연계

이 문서는 다음 두 에이전트/오케스트레이터의 기준 문서 역할을 함.

- **`.claude/agents/designer.md`** — 디자이너 에이전트가 코드 리뷰 시 이 문서의 토큰 정의를 기준으로 일관성 위반을 판정함. 임의 값(`shadow-[...]`, `rounded-[...]` 등)이 발견되면 본 문서의 토큰 매핑을 참조해 권장 수정안을 제시함.
- **`.claude/orchestrators/refactor-orchestrator.md`** (존재하는 경우) — 토큰 마이그레이션 리팩토링 시 본 문서의 매핑 표를 기준으로 변환을 수행함.

---

## 변경 이력

- **2026-05-01** — 초기 작성. shadows / radii(app-specific) / spacing.scrollViewport / hairline 토큰 추가 (Step A).
