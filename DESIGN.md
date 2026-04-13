# Mogiyoon Portfolio Design System

## 1. Visual Theme & Atmosphere

Mogiyoon은 라이트 모드 기반의 클린하고 미니멀한 개인 포트폴리오 사이트다. 밝은 흰색 캔버스 위에 slate 계열 중립색과 indigo 계열 accent가 절제된 시각적 위계를 형성한다. 전체적인 인상은 정돈된 기술 문서에 가깝되, Framer Motion 기반의 정교한 마이크로 인터랙션이 생동감을 더한다.

타이포그래피는 한국어 본문에 Noto Sans KR, 라틴 보조에 Inter, 장식적 헤딩에 Caveat를 사용하는 3계층 구조다. Noto Sans KR은 100~900 전 범위를 지원하며, 본문에서는 주로 400(regular)~700(bold)을 사용한다. Caveat는 필기체 느낌의 Display 폰트로, 로고와 장식적 타이틀에만 제한적으로 사용한다.

색상 체계는 slate/gray 중립색이 지배하고, indigo가 유일한 accent 색상으로 CTA, 뱃지, 강조 요소에만 등장한다. violet은 indigo와의 그라데이션 조합에서만 보조적으로 사용한다. amber/yellow/red는 스티커 장식 요소에 한정된다.

카드 컴포넌트는 `rounded-xl` ~ `rounded-3xl`의 부드러운 모서리와 `shadow-lg`로 은은한 깊이를 표현하며, 일부 컴포넌트에서 `backdrop-blur-md`와 반투명 배경을 결합한 glassmorphism 효과를 사용한다.

**핵심 특징:**
- 라이트 모드 기반: 흰색(`#ffffff`) 카드, `slate-50`/`gray-100` 배경
- 3계층 폰트: Noto Sans KR(본문) / Inter(라틴) / Caveat(장식)
- 유일한 accent: indigo 계열 (`indigo-500` ~ `indigo-700`)
- 카드: `rounded-xl`/`rounded-3xl` + `shadow-lg` + white bg
- Framer Motion 애니메이션: opacity + y-transform, spring physics, stagger
- 반응형: sm/md/lg breakpoint 3단계
- Tailwind CSS 유틸리티 클래스 기반 스타일링

## 2. Color Palette & Roles

### Background Surfaces
- **White** (`#ffffff`): 카드, 모달, 전면 콘텐츠 배경
- **Slate 50** (`slate-50` / `#f8fafc`): 섹션 배경, 서브 카드
- **Slate 100** (`slate-100` / `#f1f5f9`): 헤더, 내비게이션 배경
- **Slate 200** (`slate-200` / `#e2e8f0`): hover 배경, 구분선 대체

### Text & Content
- **Slate 900** (`slate-900` / `#0f172a`): 최고 강조 — 제목, 탭 텍스트, 주요 콘텐츠
- **Slate 800** (`slate-800` / `#1e293b`): 본문 텍스트 (강)
- **Slate 700** (`slate-700` / `#334155`): 준강조 — 서브 헤딩, 라벨, 보조 텍스트
- **Slate 600** (`slate-600` / `#475569`): 메타 정보, 설명
- **Slate 500** (`slate-500` / `#64748b`): 비활성 텍스트, 아이콘
- **Slate 400** (`slate-400` / `#94a3b8`): 3차 텍스트 — placeholder, 타임스탬프

### Brand & Accent
- **Indigo 700** (`indigo-700` / `#4338ca`): 강조 텍스트, 제목
- **Indigo 600** (`indigo-600` / `#4f46e5`): 아이콘, 주요 텍스트 accent (가장 빈번)
- **Indigo 500** (`indigo-500` / `#6366f1`): 버튼 배경, 그라데이션
- **Indigo 100** (`indigo-100` / `#e0e7ff`): 뱃지 배경
- **Indigo 50** (`indigo-50` / `#eef2ff`): 피처 카드 배경
- **Violet 500** (`violet-500` / `#8b5cf6`): indigo와의 그라데이션 조합 전용
- **Violet 400** (`violet-400` / `#a78bfa`): sparkle 장식, glassmorphism accent

### Status & Decorative
- **Amber 300~500**: 스티커 메달 그라데이션 (장식 전용)
- **Red 400~700**: 스티커 리본 (장식 전용)

### Border & Divider
- **Slate 200** (`slate-200` / `#e2e8f0`): 기본 테두리 (가장 빈번)
- **Slate 300** (`slate-300` / `#cbd5e1`): 약간 진한 테두리
- **White/40** (`rgba(255,255,255,0.4)`): glassmorphism 테두리

### Glassmorphism
- **배경**: `from-indigo-500/20 via-violet-500/15 to-indigo-400/20`
- **블러**: `backdrop-blur-md`
- **테두리**: `border-white/40`
- **그림자**: `shadow-[0_0_12px_rgba(99,102,241,0.3),inset_0_1px_0_rgba(255,255,255,0.4)]`

## 3. Typography Rules

### Font Family
- **본문 (한국어)**: `Noto Sans KR`, fallback: sans-serif
- **본문 (라틴)**: `Inter`, fallback: system-ui
- **Display**: `Caveat` weight 700, fallback: cursive
- **Code**: `source-code-pro`, fallback: Menlo, Monaco, Consolas, `Courier New`, monospace

### Hierarchy

| Role | Font | Size | Weight | Line Height | Usage |
|------|------|------|--------|-------------|-------|
| Hero | Noto Sans KR | text-5xl (3rem) | font-black (900) | tight | 메인 배너, 최대 임팩트 |
| Display | Caveat | text-4xl (2.25rem) | font-bold (700) | tight | 로고, 장식적 타이틀 |
| Heading 1 | Noto Sans KR | text-4xl (2.25rem) | font-bold (700) | tight | 섹션 제목 |
| Heading 2 | Noto Sans KR | text-3xl (1.875rem) | font-bold (700) | snug | 서브 섹션 |
| Heading 3 | Noto Sans KR | text-2xl (1.5rem) | font-bold (700) | snug | 카드 제목, 피처 타이틀 |
| Subtitle | Noto Sans KR | text-xl (1.25rem) | font-semibold (600) | normal | 강조 부제목 |
| Body Large | Noto Sans KR | text-lg (1.125rem) | font-normal (400) | relaxed | 섹션 설명, 소개 |
| Body | Noto Sans KR | text-base (1rem) | font-normal (400) | relaxed | 표준 본문 |
| Label | Noto Sans KR | text-sm (0.875rem) | font-semibold (600) | normal | 라벨, 메타데이터 |
| Caption | Noto Sans KR | text-sm (0.875rem) | font-medium (500) | normal | 보조 정보 |
| Small | Noto Sans KR | text-xs (0.75rem) | font-semibold (600) | normal | 뱃지, 태그, 칩 |
| Tiny | Noto Sans KR | text-[10px] | font-bold (700) | normal | Vibe 뱃지 등 극소 라벨 |

### Principles
- **font-bold와 font-semibold가 주력**: 각각 41회 사용. bold는 제목, semibold는 라벨/서브헤딩
- **font-black은 Hero 전용**: 최대 임팩트가 필요한 메인 배너에만 사용
- **본문은 항상 leading-relaxed**: 한국어의 가독성을 위해 넉넉한 행간
- **Caveat는 장식 전용**: 본문이나 UI 라벨에 절대 사용하지 않음

## 4. Component Stylings

### Cards

**Portfolio Card (기본)**
- Background: `bg-white`
- Border Radius: `rounded-xl`
- Shadow: `shadow-lg`, hover: `shadow-xl`
- Transition: `transition-shadow duration-300`
- 이미지: `rounded-[3rem]` (내부), `aspect-square object-contain`
- 3D 카드 플립: `perspective: 1000px`, `rotateY(180deg)`, `duration-700`

**Profile Section Card**
- Background: `bg-white` 또는 `bg-slate-50`
- Border: `border border-slate-200`
- Border Radius: `rounded-2xl` 또는 `rounded-[28px]`
- Shadow: `shadow-sm`
- Backdrop: `backdrop-blur` (일부)

**Feature Card**
- Background: `bg-indigo-50`
- Border: `border border-slate-200`
- Border Radius: `rounded-xl`
- Padding: `p-6`

### Buttons & Links

**Primary Button**
- Background: `bg-indigo-500` 또는 `bg-indigo-600`
- Text: white
- Radius: `rounded-lg`
- Hover: 색상 시프트 또는 shadow 증가

**Ghost Button**
- Background: transparent
- Border: `border border-slate-200`
- Text: `text-slate-700`
- Radius: `rounded-lg`
- Hover: `bg-slate-50` 또는 `bg-gray-100`

**Tab Button**
- Active: `bg-slate-900 text-white`
- Inactive: `text-slate-500`
- Radius: `rounded-xl`
- Spring animation: `stiffness: 700, damping: 30`

### Badges & Pills

**Project Type Badge**
- Background: `bg-indigo-100`
- Text: `text-indigo-700 text-xs font-medium`
- Radius: `rounded-full`
- Padding: `px-2 py-0.5`

**Tech Stack Chip**
- Background: `bg-indigo-500` (뒤면) 또는 `bg-slate-100` (프로필)
- Text: `text-white text-sm font-medium` 또는 `text-slate-700 text-xs font-semibold`
- Radius: `rounded-full`
- Border: `border border-slate-200` (프로필)

**Vibe Badge (Glassmorphism)**
- Background: `bg-gradient-to-r from-indigo-500/20 via-violet-500/15 to-indigo-400/20`
- Backdrop: `backdrop-blur-md`
- Border: `border border-white/40`
- Shadow: `shadow-[0_0_12px_rgba(99,102,241,0.3),inset_0_1px_0_rgba(255,255,255,0.4)]`
- Text: gradient `from-indigo-600 via-violet-500 to-indigo-500` with `bg-clip-text`

### Modals

**Contact Modal**
- Backdrop: `bg-black/50`
- Container: white bg, `rounded-2xl`, `shadow-2xl`, `max-w-sm`
- Animation: `animate-fade-in-up` (0.35s ease-out)
- Close: 백드롭 클릭 또는 닫기 버튼

### Navigation

**Page Header**
- Background: `bg-gray-100/80` 또는 `bg-white`
- Position: sticky top
- Tab: `rounded-xl` pill 형태, layoutId 기반 spring 전환
- 모바일: 하단 탭 바, `backdrop-blur`

## 5. Layout Principles

### Spacing System
- 기본 단위: 4px (Tailwind 기본)
- 주요 리듬: `p-4` (16px), `p-6` (24px), `p-8` (32px)
- 섹션 간격: `pt-20` (80px), `gap-6` (24px)
- 카드 내부: `p-6` (24px), `px-6 pb-4`

### Grid & Container
- 메인 컨테이너: `max-w-6xl mx-auto` (1152px)
- 프로필 섹션: `max-w-5xl` (1024px)
- 텍스트 영역: `max-w-2xl` ~ `max-w-3xl`
- 모달: `max-w-sm` (384px)

### Responsive Grid
| Breakpoint | 카드 그리드 | 주요 변화 |
|------------|------------|----------|
| 기본 (모바일) | 2 columns | 스택 레이아웃, 하단 탭 내비게이션 |
| sm (640px) | 2 columns | 여백 확장 |
| md (768px) | 3 columns | 상단 탭 전환, 사이드 레이아웃 |
| lg (1024px) | 4 columns | 전체 그리드, 넉넉한 여백 |

### Whitespace Philosophy
- **흰색이 곧 여백**: 밝은 배경이 자연스러운 섹션 구분 역할
- **섹션 격리**: `min-h-screen` + flex 중앙 정렬로 각 섹션이 독립적 페이지처럼 표현
- **카드 간 호흡**: `gap-6` (24px)로 균일한 간격

### Border Radius Scale
| Level | Value | Usage |
|-------|-------|-------|
| Pill | `rounded-full` (9999px) | 뱃지, 칩, 태그, 아바타 |
| XL3 | `rounded-3xl` (24px) | 프리미엄 카드, 강조 섹션 |
| XL2 | `rounded-2xl` (16px) | 모달, 대형 카드 |
| XL | `rounded-xl` (12px) | 표준 카드, 버튼, 탭 |
| LG | `rounded-lg` (8px) | 인풋, 소형 버튼 |
| MD | `rounded-md` (6px) | 마이크로 요소 |

## 6. Depth & Elevation

| Level | Treatment | Usage |
|-------|-----------|-------|
| Flat (L0) | shadow 없음, `bg-white` / `bg-slate-50` | 페이지 배경, 플랫 섹션 |
| Subtle (L1) | `shadow-sm` | 프로필 카드, 리스트 아이템 |
| Standard (L2) | `shadow-md` | hover 상태, 중간 강조 |
| Elevated (L3) | `shadow-lg` | 포트폴리오 카드, 주요 컴포넌트 |
| High (L4) | `shadow-xl` | 활성 카드, hover 피드백 |
| Maximum (L5) | `shadow-2xl` | 모달, 오버레이 |
| Glow | `shadow-[0_0_12px_rgba(99,102,241,0.3)]` | Glassmorphism 뱃지 |
| Deep | `shadow-[0_10px_30px_rgba(0,0,0,0.35)]` | 이미지 강조 |

**Shadow Philosophy**: 라이트 테마에서 shadow는 주요 깊이 표현 수단이다. 카드는 기본 `shadow-lg`를 갖고, hover 시 `shadow-xl`로 한 단계 올라가는 것이 표준 패턴이다. 모달은 `shadow-2xl`로 최대 elevation을 표현하며, 배경의 `bg-black/50` 오버레이와 결합한다.

## 7. Do's and Don'ts

### Do
- slate/gray 중립색을 기본으로, indigo를 유일한 accent로 사용
- 카드에는 항상 `rounded-xl` 이상의 모서리와 `shadow-lg` 적용
- 모든 인터랙티브 요소에 hover 상태를 명시 (`transition-colors duration-200` 기본)
- Framer Motion의 opacity + y-transform 조합으로 진입 애니메이션
- 리스트에는 `staggerChildren: 0.07`로 순차 진입
- spring 물리학으로 자연스러운 전환 (`stiffness: 400, damping: 17` 기본)
- 뱃지/칩은 `rounded-full` + `text-xs font-semibold`
- i18n: 모든 사용자 대면 텍스트에 `t()` 함수 사용
- 한국어 본문은 `leading-relaxed`로 가독성 확보

### Don't
- 직각 모서리(`rounded-none`, `rounded-sm`)를 카드에 사용하지 않음
- 트랜지션 없이 즉각 상태 변경하지 않음 (최소 `duration-200`)
- `duration-500` 이상의 느린 트랜지션 사용 금지 (카드 플립 `duration-700`만 예외)
- Framer Motion에서 scale만 단독 사용 금지 — 반드시 opacity/y와 조합
- indigo 외의 새로운 accent 색상(emerald, rose 등)을 도입하지 않음
- Caveat 폰트를 본문이나 UI 라벨에 사용하지 않음 — Display 전용
- Tailwind 기본 애니메이션(`animate-ping`, `animate-bounce`)을 장식 목적으로 사용하지 않음 — 로딩 상태에만 허용
- 하드코딩 텍스트를 UI에 넣지 않음 — i18n 키 사용 필수

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <640px | 2col 그리드, 하단 탭 바, 컴팩트 패딩 |
| Tablet (sm) | 640px | 여백 확장, 2col 유지 |
| Desktop Small (md) | 768px | 3col 그리드, 상단 탭 전환, 사이드 레이아웃 |
| Desktop (lg) | 1024px | 4col 그리드, 전체 레이아웃, 넉넉한 여백 |

### Touch Targets
- 버튼: 최소 `p-2` (8px) 패딩, `rounded-lg` 이상
- 탭: 충분한 터치 영역, `rounded-xl` pill
- 칩: `px-2 py-0.5` ~ `px-3 py-1` 수평 여유
- 닫기 버튼: 명확한 크기와 hover 피드백

### Collapsing Strategy
- 내비게이션: 상단 탭 → 하단 탭 바 (md breakpoint)
- 카드 그리드: 4col → 3col → 2col
- 텍스트 크기: text-sm (모바일) → text-base (데스크톱)
- 섹션 패딩: 축소 (`p-4` → `p-8`)
- 카드 설명: `line-clamp-3`로 텍스트 절단

## 9. Animation System (Framer Motion)

### Page Transition
```
initial: { opacity: 0, y: 12 }
animate: { opacity: 1, y: 0 }
transition: { type: "tween", ease: "easeOut", duration: 0.25 }
```

### List & Item Stagger
```
list: { staggerChildren: 0.07 }
item: { 
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } }
}
```

### Spring Physics
| Context | Stiffness | Damping | Usage |
|---------|-----------|---------|-------|
| Hover uplift | 400 | 17 | `whileHover: { y: -2 }` on chips |
| Tab switch | 700 | 30 | layoutId background 전환 |
| Toggle | 700 | 30 | Switch 슬라이딩 |

### Easing Presets
- **easeOut**: 표준 진입 (0.22s~0.3s)
- **easeInOut**: 부드러운 전환 (0.22s~0.28s)
- **Custom**: `[0.22, 1, 0.36, 1]` — 이미지 진입 (1.0s)
- **Cubic-bezier**: `cubic-bezier(0.68, -0.55, 0.27, 1.55)` — 토스트 바운스

### Transition Duration Scale
| Duration | Usage |
|----------|-------|
| 100ms | 버튼 press 피드백 |
| 150ms | 마이크로 인터랙션 |
| 200ms | 빠른 hover, exit |
| 250ms | 페이지 전환 |
| 280ms | 아이템 진입 |
| 300ms | 표준 hover, 그림자 전환 |
| 700ms | 카드 플립 (예외적 긴 전환) |

### Agent Prompt Guide

#### Quick Color Reference
- Primary CTA: `bg-indigo-500`
- Page Background: `bg-white` / `bg-slate-50`
- Card Background: `bg-white`
- Heading text: `text-slate-900`
- Body text: `text-gray-700` / `text-slate-700`
- Muted text: `text-slate-400` / `text-gray-400`
- Accent text: `text-indigo-600`
- Border (default): `border-slate-200`
- Badge bg: `bg-indigo-100 text-indigo-700`

#### Example Component Prompts
- "Create a portfolio card: `bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300`. Image `aspect-square object-contain rounded-[3rem]`. Title `text-2xl font-bold`. Badge `bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full px-2 py-0.5`."
- "Build a section: `min-h-screen flex items-center justify-center`. Container `max-w-6xl mx-auto`. Heading `text-4xl font-bold text-slate-900`. Body `text-lg text-gray-700 leading-relaxed`."
- "Create a chip list with Framer Motion: list variants `staggerChildren: 0.07`, item variants `hidden: { opacity: 0, y: 12 }`, `show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } }`. whileHover `{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 17 } }`."
- "Design a modal: `fixed inset-0 bg-black/50` backdrop. Content `bg-white rounded-2xl shadow-2xl max-w-sm mx-auto p-6 animate-fade-in-up`."
