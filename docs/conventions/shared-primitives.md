# 공통 프리미티브 사용 가이드 (Shared Primitives)

이 문서는 mogiyoon 코드베이스에서 추출 완료된 공통 hooks / components / utils / design tokens 의 사용법을 모아둔 단일 진입점이다. 새 기능을 추가하거나 기존 기능을 수정하기 전에 반드시 이 문서를 먼저 스캔해서 직접 작성하려는 패턴이 이미 프리미티브로 존재하는지 확인할 것.

규칙:

- 인라인 `useEffect` / `useState` / `className` 조합을 새로 작성하기 전에 아래 TL;DR 표를 먼저 본다.
- 동일하거나 유사한 패턴이 있으면 프리미티브를 사용한다. 미묘하게 다른 경우는 프리미티브를 확장해서 사용한다 (인라인 복제 금지).
- 프리미티브에 없는 새로운 패턴이 2곳 이상 동시에 필요해질 때 비로소 신규 프리미티브를 제안한다.

## TL;DR — "X 하고 싶다" → "Y 를 쓴다"

| 하고 싶은 것 | 쓰는 것 | 위치 |
|---|---|---|
| 작은 라벨 / 태그 / 배지 (pill) | `Chip` | `src/components/primitives/Chip.tsx` |
| 모달 셸 (백드롭 + 패널 + Esc + 스크롤락) | `ModalShell` | `src/components/primitives/ModalShell.tsx` |
| 카드 앞면 ↔ 뒷면 3D flip | `FlippableCard` | `src/components/primitives/FlippableCard.tsx` |
| 펼침 / 접힘 boolean 상태 (`isOpen / open / close / toggle`) | `useDisclosure` | `src/hooks/useDisclosure.ts` |
| 모달 / 오버레이가 열린 동안 body 스크롤 잠그기 | `useBodyScrollLock` | `src/hooks/useBodyScrollLock.ts` |
| Esc 키로 닫기 | `useEscapeKey` | `src/hooks/useEscapeKey.ts` |
| 드롭다운 / 팝오버 외부 클릭 감지 | `useClickOutside` | `src/hooks/useClickOutside.ts` |
| 클립보드 복사 + 토스트 자동 노출/해제 | `useCopyToClipboardWithToast` | `src/hooks/useCopyToClipboardWithToast.ts` |
| `<img>` 깨졌을 때 placeholder 로 swap | `createImageFallbackHandler` | `src/utils/imageFallback.ts` |
| placeholder 이미지 URL (Image Not Found / Coming Soon / Project Image) | `PLACEHOLDER_*` 상수 | `src/utils/placeholders.ts` |
| 카드 / 토스트 등 모션의 cubic-bezier 곡선, 토스트 노출 시간 | `easings.*`, `TOAST_VISIBLE_MS` | `src/design-tokens.ts` |

---

## Components

### `Chip` (`src/components/primitives/Chip.tsx`)

**언제 쓰나**

- 작은 라벨 / 태그 / 배지를 보여줄 때 (기술 스택 칩, 카테고리 태그, 상태 뱃지 등)
- 새 인라인 `rounded-full` pill 마크업을 작성하기 전에 항상 먼저 확인할 것
- 현재 9개 사이트에서 사용 중인 가장 빈도 높은 프리미티브

**기본 사용법**

```tsx
import Chip from '@/components/primitives/Chip';

<Chip tone="accentSoft" size="sm">React</Chip>
<Chip tone="outlined" size="md" weight="semibold">Frontend</Chip>
```

**Tones / sizes / weights** — 이미 정의된 값 안에서 골라서 사용한다.

- `tone`: `accentSoft` (default 추천 — indigo 약함) / `accentSolid` (indigo 강함) / `neutralSoft` (slate 약함, 기본값) / `outlined` / `outlinedStrong`
- `size`: `sm` (default) / `md` / `mdWide` / `xs` / `xsTall`
- `weight`: `medium` (default) / `semibold`

새 tone 을 추가하려면 2개 이상의 사이트에서 같은 조합이 필요할 때만, 그리고 디자인 합의가 끝난 뒤에 한다.

**자주 하는 실수**

- 인라인으로 `<span className="rounded-full bg-x text-y px-2 py-1">` 를 새로 작성 → Chip 을 먼저 검토할 것
- tone 에 없는 색을 className 으로 강제 override → 디자인 시스템 일관성이 깨진다. 진짜 새 톤이 필요하면 `Chip.tsx` 의 `TONE_CLASSES` 에 추가하고 코멘트로 정당화한다
- `<button>` 처럼 클릭 가능한 요소가 필요할 때 Chip 을 wrap 하지 말고, Chip 자체가 `<span>` 임을 인지한 채 별도 wrapping 한다

---

### `ModalShell` (`src/components/primitives/ModalShell.tsx`)

**언제 쓰나**

- 풀스크린 백드롭 + 중앙 패널 + Esc 닫기 + body 스크롤 락이 필요한 모든 모달
- AiDevKitModal, ContactModal 등이 이미 사용 중

**기본 사용법**

```tsx
import ModalShell from '@/components/primitives/ModalShell';

<ModalShell
  isOpen={isOpen}
  onClose={close}
  className="max-w-2xl mx-auto mt-24 p-6"
>
  <header>...</header>
  <section>...</section>
</ModalShell>
```

**제공되는 동작**

- `isOpen=false` 면 아무것도 렌더링하지 않음 (포털 없이 inline 렌더)
- 열려 있는 동안 `useBodyScrollLock` + `useEscapeKey` 자동 적용
- 백드롭 클릭 → `onClose`. 패널 클릭은 `stopPropagation` 처리됨
- 헤더 / 콘텐츠 마크업은 `children` 슬롯으로 호출자가 직접 제공

**자주 하는 실수**

- 백드롭 div 와 panel div 를 직접 작성하면서 `useBodyScrollLock` / `useEscapeKey` 를 빼먹음 → ModalShell 이 두 훅을 묶어서 보장해 준다
- 패널 클릭이 백드롭으로 전파되어 모달이 닫히는 버그 → ModalShell 은 이미 `stopPropagation` 처리됨. 직접 만들면 잊기 쉬움
- `className` 에 `fixed inset-0` 을 다시 넣음 → backdrop 이 이미 fixed 이고, `className` 은 panel 에 붙는다. 백드롭 커스터마이즈는 `backdropClassName` 을 사용

---

### `FlippableCard` (`src/components/primitives/FlippableCard.tsx`)

**언제 쓰나**

- 카드의 앞면 ↔ 뒷면을 3D rotateY 로 전환하고 싶을 때
- PortfolioCard (hover-driven), ProjectFlipPreviewCard (auto-rotate) 가 사용 중

**기본 사용법**

```tsx
import FlippableCard from '@/components/primitives/FlippableCard';

<FlippableCard
  isFlipped={isFlipped}
  className="w-full aspect-square"
  front={<div>앞면</div>}
  back={<div>뒷면</div>}
  onMouseEnter={() => setIsFlipped(true)}
  onMouseLeave={() => setIsFlipped(false)}
/>
```

**제공되는 동작**

- 외곽에 `perspective: 1000px` 인라인 스타일 (테스트가 `div[style*="perspective"]` 로 찾을 수 있도록 의도적으로 인라인)
- 안쪽 회전 div: `transition-transform duration-700`, `preserve-3d`
- 두 면 모두 `position: absolute inset-0`, `backfaceVisibility: hidden`. 뒷면은 baseline 에서 `rotateY(180deg)` 적용됨

**자주 하는 실수**

- aspect / sizing 을 primitive 안에 넣으려 함 → 그 책임은 호출자에게 있다. `className` (외곽 wrapper) 으로 aspect-square / aspect-[3/4] 등을 지정
- flip 트리거 (hover vs click vs auto rotate) 를 primitive 가 결정하게 만들지 말 것 → `isFlipped` boolean 만 받고, 호출자가 driver 결정
- duration 은 700ms 로 하드코딩되어 있음. 다른 값이 필요하면 `innerClassName` 으로 override (예: `duration-500`) 가능하지만, 디자인 시스템상 700ms 가 표준임

---

## Hooks

### `useDisclosure` (`src/hooks/useDisclosure.ts`)

**언제 쓰나**

- 모달 / 드롭다운 / 아코디언 / hover-flip 등 boolean on/off 상태가 필요한 모든 곳
- `useState(false)` 와 `set...(true)` / `set...(false)` / `set...(prev => !prev)` 를 손으로 작성하려고 할 때

**기본 사용법**

```tsx
import { useDisclosure } from '@/hooks/useDisclosure';

const { isOpen, open, close, toggle, setIsOpen } = useDisclosure(false);

<button onClick={toggle}>Toggle</button>
<button onMouseEnter={open} onMouseLeave={close}>Hover me</button>
<ModalShell isOpen={isOpen} onClose={close}>...</ModalShell>
```

**자주 하는 실수**

- `useState<boolean>(false)` + 직접 `setOpen` 호출을 새로 작성 → useDisclosure 를 먼저 쓸 것
- hover-driven 인 곳에서 `toggle` 만 쓰고 `open` / `close` 를 안 쓰는 경우 → hover 에서는 명시적으로 `open` / `close` 로 분리해야 race 없이 동작

---

### `useBodyScrollLock` (`src/hooks/useBodyScrollLock.ts`)

**언제 쓰나**

- 모달 / 풀스크린 오버레이 / 사이드바가 열린 동안 body 가 스크롤되지 않게 막을 때
- ModalShell 이 이미 내부에서 사용 중. ModalShell 을 쓴다면 따로 호출할 필요 없음

**기본 사용법**

```tsx
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

useBodyScrollLock(isOpen);
```

**제공되는 동작**

- `active=false` 면 아무것도 하지 않음
- 활성 시점에 직전 `document.body.style.overflow` 값을 snapshot 하고 cleanup 시 그 값으로 복원함 (빈 문자열 아님 — 다중 모달이 중첩되는 케이스에서 의도된 동작)

**자주 하는 실수**

- cleanup 에서 `document.body.style.overflow = ''` 로 직접 복원 → 이전 모달이 잠가둔 상태를 풀어버린다. 항상 이 훅을 사용
- ModalShell 사용처에서 `useBodyScrollLock` 을 또 호출 → 중복. ModalShell 이 이미 호출함

---

### `useEscapeKey` (`src/hooks/useEscapeKey.ts`)

**언제 쓰나**

- Esc 키로 모달 / 팝오버 / 드롭다운을 닫고 싶을 때
- ModalShell 내부에서 자동으로 사용됨. ModalShell 을 쓴다면 따로 호출할 필요 없음

**기본 사용법**

```tsx
import { useEscapeKey } from '@/hooks/useEscapeKey';

useEscapeKey(isOpen ? close : null, isOpen);
```

**제공되는 동작**

- `handler` 가 `null` / `undefined` 이거나 `active=false` 면 리스너 미등록
- 핸들러 ref 패턴으로 리스너는 한 번만 등록되며, 핸들러가 매 렌더 새로 만들어져도 안전함

**자주 하는 실수**

- 핸들러를 매번 새로 만들어 리스너가 add/remove 를 반복할 거라 걱정 → 이 훅은 ref 로 latest 를 추적하므로 안전하다
- 리스너를 직접 `window.addEventListener('keydown', ...)` 로 추가 → 항상 이 훅을 사용

---

### `useClickOutside` (`src/hooks/useClickOutside.ts`)

**언제 쓰나**

- 드롭다운 / 팝오버 / 컨텍스트 메뉴 외부 클릭으로 닫기
- PageHeader 가 사용 중

**기본 사용법**

```tsx
import { useClickOutside } from '@/hooks/useClickOutside';

const ref = useRef<HTMLDivElement>(null);
const { isOpen, close } = useDisclosure();

useClickOutside(ref, close, isOpen);

<div ref={ref}>...drop down...</div>
```

**제공되는 동작**

- `mousedown` 이벤트 사용 (focus 변화 전에 실행되어야 dropdown 이 자연스럽게 닫힌다)
- `active=false` 면 리스너 미등록

**자주 하는 실수**

- `click` 이벤트로 직접 구현 → focus 트랩 / 다중 dropdown 시 race 가 발생한다. `mousedown` 이 의도된 선택
- `active` 인자를 빼먹어서 항상 리스너가 붙음 → 닫혀 있을 때 불필요한 리스너 비용

---

### `useCopyToClipboardWithToast` (`src/hooks/useCopyToClipboardWithToast.ts`)

**언제 쓰나**

- 어떤 텍스트를 클립보드에 복사하고, 성공 / 실패 토스트를 일정 시간 띄웠다가 자동으로 사라지게 하고 싶을 때
- TotalSummaryComponent 가 사용 중

**기본 사용법**

```tsx
import { useCopyToClipboardWithToast } from '@/hooks/useCopyToClipboardWithToast';

const { toast, copy } = useCopyToClipboardWithToast();

await copy('hello@mogiyoon.com', {
  success: '복사되었습니다',
  failure: '복사에 실패했습니다',
});

{toast.message && (
  <div className={toast.isSuccess ? 'bg-green-500' : 'bg-red-500'}>
    {toast.message}
  </div>
)}
```

**제공되는 동작**

- `navigator.clipboard.writeText` 호출, 성공/실패에 따라 다른 메시지를 토스트로 띄움
- 기본 노출 시간 `TOAST_VISIBLE_MS` (3000ms — design-tokens 의 단일 source). 인자로 override 가능
- 빠르게 연속 호출되면 직전 setTimeout 을 정리하여 race 방지
- 언마운트 시에도 미해제 타이머 정리

**자주 하는 실수**

- 인라인으로 `setTimeout` + `setMessage(null)` 을 작성 → 연속 복사 시 토스트가 너무 빨리 사라지거나 늦게 사라지는 버그가 생긴다
- `durationMs` 를 임의 숫자로 override → `TOAST_VISIBLE_MS` 를 import 해서 사용하거나, 디자인 합의 후 토큰을 추가할 것

---

## Utilities

### `createImageFallbackHandler` (`src/utils/imageFallback.ts`)

**언제 쓰나**

- `<img>` 가 404 났을 때 placeholder 이미지로 자동 swap 하고 싶을 때
- PortfolioCard, PreparingCard, ProjectFlipPreviewCard, ProjectDetailPage 가 사용 중

**기본 사용법**

```tsx
import { createImageFallbackHandler } from '@/utils/imageFallback';
import { PLACEHOLDER_NOT_FOUND_300x300 } from '@/utils/placeholders';

<img
  src={src}
  onError={createImageFallbackHandler({
    fallbackSrc: PLACEHOLDER_NOT_FOUND_300x300,
    onAfter: () => setIsLoaded(true),
  })}
/>
```

**제공되는 동작**

- 첫 호출 시 `img.onerror = null` 로 리스너를 제거하므로 fallback 자체가 404 나도 무한 루프에 빠지지 않음
- `fallbackSrc` 기본값은 `PLACEHOLDER_NOT_FOUND_300x300`
- `onAfter` 콜백 (예: 로딩 스피너 해제) 옵션

**자주 하는 실수**

- `onError={(e) => { e.currentTarget.src = '...' }}` 인라인 작성 → 무한 루프 방어 (`onerror = null`) 를 빼먹기 쉽다
- placeholder URL 을 string literal 로 직접 박음 → 아래 `placeholders.ts` 의 상수를 import 해서 사용

---

### `placeholders.ts` (`src/utils/placeholders.ts`)

**언제 쓰나**

- placeholder 이미지 URL 이 필요할 때. 호스트는 `placehold.co` 로 통일됨 (legacy `via.placeholder.com` 사용 금지)

**제공되는 상수**

- `PLACEHOLDER_NOT_FOUND_300x200` / `_300x300` / `_250x400` / `_250x150` — 이미지 로드 실패 fallback (gray on gray)
- `PLACEHOLDER_PROJECT_IMAGE_300x300` — 스크린샷 없을 때 기본 프로젝트 썸네일
- `PLACEHOLDER_COMING_SOON_300x300` — PreparingCard 에서 사용

**자주 하는 실수**

- `https://placehold.co/...` URL 을 코드에 직접 박음 → 동일 dimension 의 상수가 이미 있을 가능성이 높다. 새 dimension 이 필요하면 이 파일에 명명된 상수를 추가
- 다른 placeholder 호스트 (예: via.placeholder.com, dummyimage.com) 사용 → `placehold.co` 로 통일

---

## Design Tokens 추가분

### `easings` (`src/design-tokens.ts`)

cubic-bezier 곡선을 framer-motion / 인라인 스타일에서 일관되게 쓰기 위한 토큰.

```ts
import { easings } from '@/design-tokens';

// framer-motion
<motion.div animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: easings.standard }} />

// project card 진입/퇴장 애니메이션
useProjectGridEntrance() // 내부에서 easings.projectCard 사용
```

**제공되는 키**

- `easings.projectCard` — `[0.22, 1, 0.36, 1]` — 프로젝트 카드 진입 / 퇴장. 부드러운 out-back 느낌
- `easings.toast` — `[0.68, -0.55, 0.27, 1.55]` — 토스트의 살짝 튀는 over-shoot
- `easings.standard` — `[0.4, 0, 0.2, 1]` — Material standard. 일반 인터랙션 기본값

**자주 하는 실수**

- 새 cubic-bezier 튜플을 컴포넌트 안에 직접 박음 → 두 곳 이상에서 같은 곡선이 쓰이면 토큰화한다
- `as const` 없이 `[0.22, 1, 0.36, 1]` 작성 → framer-motion 타입이 `number[]` 가 아니라 4-tuple 을 요구하므로 `as readonly [number, number, number, number]` 가 필요. 토큰을 import 하면 이 문제가 자동 해결됨

---

### `TOAST_VISIBLE_MS` (`src/design-tokens.ts`)

토스트가 표시된 후 자동으로 사라지기까지의 시간 (ms). 현재 `3000`.

```ts
import { TOAST_VISIBLE_MS } from '@/design-tokens';
```

`tailwind.config.ts` 의 `toast-in-out` 키프레임 duration (`3s`) 과 `useCopyToClipboardWithToast` 의 setTimeout 모두 이 값을 단일 source 로 함. 변경 시 양쪽이 자동으로 sync 되도록 항상 토큰을 import 한다.

**자주 하는 실수**

- 컴포넌트에서 `setTimeout(..., 3000)` 를 매직 넘버로 박음 → 토스트 keyframe 과 sync 가 깨질 수 있다

---

## Deferred / not yet primitives

아래 항목들은 오케스트레이터가 후속 PR 로 처리할 예정이다. 지금은 인라인으로 두고, 직접 추출하지 말 것 (선행 의존성, 테스트 부재, 디자인 결정 대기 등의 이유로 deferred 됨).

| ID | 제목 | 임시 처리 |
|---|---|---|
| D-001 | useToggleSet (Set add/delete toggle) | 인라인 사용. ResumePreviewPage 의 characterization 테스트 후 추출 |
| D-002 | useFetchJson / useLocalizedResource | 인라인 fetch 유지. InfoPost / ResumePreviewPage 테스트 부재 + 형태 다양 |
| D-003 | ProjectCardFrame shell (썸네일 + 제목 + 부제 + 뱃지) | 인라인. B-013 Chip 으로 highest-value sub-extraction 선행 |
| D-004 | ExpandableCard primitive (chevron 헤더 + collapsible body) | 인라인. max-h transition vs 조건부 render 표준화는 UX 결정 필요 |
| D-005 | CardSkeleton placeholder | 인라인. 두 번째 loading state 가 생기면 추출 |
| D-006 | ExternalLinkArrowIcon + icon 모듈 통합 | 인라인. 후속 icon-consolidation PR 로 묶음 |
| D-007 | LinkButton primitive | 인라인. ContactModal / PageHeader Info 버튼 리팩터 후 두 번째 사이트 생기면 추출 |
| D-008 | InfoCell primitive | 인라인. TotalSummaryComponent overview 리팩터와 페어링 |
| D-009 | bg-slate-* / border-slate-* / text-slate-* → surface/content/line 토큰 sweep | 인라인 className 유지. B-013/B-014/B-015 가 정착한 뒤 sweep |
| D-010 | card-shell utility (rounded-3xl border-line bg-surface/80 backdrop-blur) | 인라인. AwardCard / CertificationCard / WorkExperienceCard 테스트 부재 |
| D-011 | resume-preview card primitives + hardcoded backgrounds + 임의 radii | 인라인. ResumePreviewPage 테스트 + print/PDF 회귀 도구 필요 |
| D-012 | polaroid shadow / indigo glow / card-title min-height 토큰 | 인라인. 시각적 회귀 도구 또는 디자이너 컨펌 필요 |
| D-013 | 매직 300ms card-exit navigation delay | 인라인. B-006 후속 touch-up PR 에 묶을 가능성 |

신규 패턴이 두 곳 이상에서 동일하게 필요해지면, 위 deferred 목록에 있는지 먼저 확인하고 (있으면 오케스트레이터에 의뢰) 없으면 신규 프리미티브 제안을 진행한다.
