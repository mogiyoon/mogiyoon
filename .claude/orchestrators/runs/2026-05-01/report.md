# Refactor Orchestrator Run Report — 2026-05-01

## Summary
- Branch: `refactor/extract-shared-primitives`
- Base: `develop`
- Total commits: 8 (1 Phase 0 test scaffolding + 7 refactor batches)
- Total diff vs `develop`: ~6,263 insertions / ~573 deletions across ~61 files (src-only: ~3,913 / ~573 across ~52 files; remainder is `.claude/orchestrators/` artifacts)
- Final state: `tsc --noEmit` PASS, `vitest` 136 passed / 1 skipped (19 test files), `eslint` clean

## Phase 0 — Safety Net

The TestScaffolder generated characterization tests for the 14 top-priority modules identified by the CoverageMapper (commit `c464645`). New test files (~2,917 LOC of test code), taking the suite from 2 files / ~25 tests → 19 files / 136 passing / 1 skipped:

- AnswerChecker, IntroLine
- AiDevKitModal/{DetailItems, FlowDiagram, SkillGroups, index}
- PageHeader, PortfolioCard, PreparingCard, TotalSummaryComponent
- useProjectFlipPreview, useProjectGridEntrance
- sections/home/{ProfileSection, ProjectsSection}

Each suite anchors a `key_behaviors_to_lock` checklist defined in `coverage-map.json`.

## Phase 1 — Analysis

Four scouts produced **35 raw candidates** (hook 8, component 9, token 10, general 8). The Synthesizer deduped overlapping suggestions (e.g. easings appeared in both general and token streams; placeholder URLs in both hook and token streams) down to **28 unique items**, then split them into **15 top-priority** (B-001 … B-015) and **13 deferred** (D-001 … D-013) on the basis of `tested_consumer_ratio`, blast radius, and dependency edges.

## Phase 2 — Plan

The Planner sequenced the 15 backlog items into **7 batches**, respecting all `depends_on` edges (longest chain: B-008 → B-009 → B-014). Critical-path rationale:

1. Dead code first so later batches don't re-touch zombie files.
2. Independent hooks + tokens before any primitive that consumes them.
3. Image-fallback isolated as its own medium-risk batch.
4. Chip before FlippableCard so PortfolioCard / ProjectFlipPreviewCard pill markup settles before the flip wrapper rewires their JSX.
5. ModalShell scheduled after both `useBodyScrollLock` and `useEscapeKey` land (its constructor inputs).

Estimated total diff per plan: 1,294 lines. Actual src-only churn: ~1,200 lines net.

## Phase 3 — Execution

| batchId   | items                              | status | commit SHA | tests after | notable |
|-----------|------------------------------------|--------|------------|-------------|---------|
| batch-001 | B-001, B-002, B-003, B-004, B-005  | PASS   | `41d1f29`  | 136/1 skip  | `git mv` preserved blame on ShootingStart→ShootingStar; 5 dead files purged |
| batch-002 | B-006, B-008, B-010, B-012         | PASS   | `0b117c3`  | 136/1 skip  | PROJECT_CARD_EASE re-exported from hook for back-compat with existing test mock |
| batch-003 | B-009, B-011                       | PASS   | `dd8dde8`  | 136/1 skip  | TotalSummaryComponent toast-clear race fixed; `toastVisibleMs=3000` added to design-tokens |
| batch-004 | B-007                              | PASS   | `52571e9`  | 136/1 skip  | `via.placeholder.com` → `placehold.co` normalization across 5 sites |
| batch-005 | B-013                              | PASS   | `8cab11e`  | 136/1 skip  | Chip primitive consumed at 9 sites; `neutralSoft` retains `bg-slate-200` for D-009 sweep |
| batch-006 | B-014                              | PASS   | `5776b5a`  | 136/1 skip  | ContactModal gains Escape + body-scroll-lock as a deliberate positive change |
| batch-007 | B-015                              | PASS   | `7e4fd61`  | 136/1 skip  | FlippableCard does not hard-code aspect/sizing — caller passes className |

Every batch ended `tsc PASS / vitest 136 passed, 1 skipped / eslint clean`.

## Net new primitives created

**Hooks** (`src/hooks/`):
- `useBodyScrollLock.ts` — snapshots `document.body.style.overflow`, sets `'hidden'` while active, restores the snapshotted value (NOT `''`) on cleanup.
- `useDisclosure.ts` — boolean expand/collapse with explicit `open` / `close` / `toggle` for hover-driven sites.
- `useClickOutside.ts` — attaches `mousedown` only while active so dropdowns close before focus changes.
- `useEscapeKey.ts` — latest-handler ref pattern, attaches to `window` keydown.
- `useCopyToClipboardWithToast.ts` — clipboard write + auto-clearing toast, cancels pending timer on unmount or rapid re-copy (fixes the orphan-setTimeout race).

**Components** (`src/components/primitives/`):
- `Chip.tsx` — pill primitive with tones `accentSoft | accentSolid | neutralSoft | outlined | outlinedStrong` and sizes `sm | md | mdWide | xs | xsTall` and weights `medium | semibold`. Replaces 9 inline pill-class combos.
- `ModalShell.tsx` — backdrop + panel composition that internally consumes `useBodyScrollLock` + `useEscapeKey`. `rounded-modal + bg-surface + shadow-2xl + animate-fade-in-up`. Children are a free slot.
- `FlippableCard.tsx` — outer `perspective:1000px`, inner `preserve-3d` + `transition-transform duration-700`, two absolute faces with `backfaceVisibility:hidden`. Driver-agnostic (hover or auto-rotate).

**Utils** (`src/utils/`):
- `placeholders.ts` — `PLACEHOLDER_NOT_FOUND_*`, `PLACEHOLDER_PROJECT_IMAGE_*`, `PLACEHOLDER_COMING_SOON_*` constants on `placehold.co` (kept dimension suffixes since each consumer uses a different aspect ratio).
- `imageFallback.ts` — `createImageFallbackHandler({ fallbackSrc, onAfter? })` setting `e.currentTarget.onerror = null` to prevent infinite loops.

**Design tokens** (`src/design-tokens.ts`):
- `easings.{projectCard, toast, standard}` typed as `readonly [number, number, number, number]`.
- `TOAST_VISIBLE_MS = 3000` (kept in sync with toast keyframe duration).

## Behavior changes worth flagging in PR review

- **ContactModal now closes on Escape and locks body scroll** — deliberate positive change introduced when ContactModal adopted `ModalShell` in batch-006. Brings parity with AiDevKitModal.
- **`ProjectDetailComponent`'s `onError` handler now sets `e.currentTarget.onerror = null`** — previously absent, leaving a theoretical infinite-loop hazard if the placeholder ever 404'd. Now centralized in `createImageFallbackHandler`.
- **`via.placeholder.com` → `placehold.co` normalization** — `ProjectDetailComponent` was the lone holdout on the old host; all 5 placeholder sites now resolve through `PLACEHOLDER_*` constants.
- **`TotalSummaryComponent`'s toast clear no longer races on rapid copies** — the inline `setTimeout` was orphaned on each new copy; `useCopyToClipboardWithToast` cancels the pending timer before scheduling a new one.
- **`ShootingStart.tsx` → `ShootingStar.tsx`** — typo fix via `git mv` (blame preserved).
- **PROJECT_CARD_EASE** still exports from `src/hooks/useProjectGridEntrance.ts` — it now re-exports the canonical value from `design-tokens.easings.projectCard` so the existing test mock continues to resolve.

## Skipped / deferred items

| id    | title | reason |
|-------|-------|--------|
| D-001 | Extract `useToggleSet` (Set add/delete toggle) | ResumePreviewPage (3 of 5 occurrences) is untested. |
| D-002 | Extract `useFetchJson` / `useLocalizedResource` | InfoPost and ResumePreviewPage are untested consumers; prefetch-cache vs no-cache shapes diverge. |
| D-003 | Extract `ProjectCardFrame` shell | ProjectFlipPreviewCard variant untested; overlay placement diverges across the three sites. |
| D-004 | Extract `ExpandableCard` primitive | WorkExperienceCard uses `max-h` transition while AiDevKit cards use conditional render; standardizing animation is a UX choice. |
| D-005 | Extract `CardSkeleton` placeholder | Single current callsite. |
| D-006 | Extract `ExternalLinkArrowIcon` + consolidate icon module | Pure icon move; safe but low-value alone. |
| D-007 | Extract `LinkButton` primitive | Single consumer today. |
| D-008 | Extract `InfoCell` primitive | Cosmetic with two sites. |
| D-009 | Replace `bg-slate-*` / `border-slate-*` / `text-slate-*` with `surface` / `content` / `line` tokens | 60-occurrence sweep; ResumePreviewPage (24 of 60 sites) untested. |
| D-010 | Extract card-shell utility (`rounded-3xl border-line bg-surface/80 backdrop-blur`) | 9 sites including untested AwardCard / CertificationCard / WorkExperienceCard. |
| D-011 | Extract resume-preview card primitives + hardcoded backgrounds + arbitrary radii | All center on ResumePreviewPage (zero tests); print/PDF visual regression risk is high. |
| D-012 | Add polaroid shadow tokens + indigo glow tokens + card-title min-height utilities | Visual delicacy needs browser verification and a UX call. |
| D-013 | Extract magic 300ms card-exit navigation delay | Truly minor. |

## Suggested next runs

- **Highest leverage now**: D-009 (`bg-slate-*` → `surface` / `content` / `line` token sweep). Phase 3 deliberately landed primitives first so this sweep won't churn the same lines twice.
- **Unblock the deferred queue**: add characterization tests for `ResumePreviewPage` and `MyInformation/InfoPost`. These two pages gate D-001, D-002, D-003, D-009 (24 sites), D-010, and the entire D-011 bundle.
- **Visual regression tooling for D-012**: polaroid shadows, PortfolioCard sheen, and card-title min-height divergence cannot be safely refactored without a screenshot baseline.
- **Icon consolidation**: bundle D-006 with `AiDevKitModal/icons.tsx` into a single icon-module PR.

## Files touched (summary)

- `src/hooks/` — 5 new hook files; `useIntersectionObserver.ts` deleted; `useProjectGridEntrance.ts` rewires PROJECT_CARD_EASE re-export; 2 new hook test files.
- `src/components/primitives/` — new directory: `Chip`, `ModalShell`, `FlippableCard` (+ tests for each).
- `src/components/` — `PortfolioCard`, `PreparingCard`, `ProjectFlipPreviewCard`, `ContactModal`, `PageHeader`, `ProjectDetailComponent`, `TotalSummaryComponent`, `AiDevKitModal/{index,SkillGroups,DetailItems}` consume primitives/hooks; `InfoIcon` and `TotalProjectCard/index` deleted.
- `src/components/AboutMe/` — `ShootingStart.tsx` renamed; `MyInformation/{WorkExperienceCard, CertificationCard, EducationCard, Section/WorkSection}` adopt Chip; `IntroLine.test.tsx` and `AnswerChecker.test.tsx` added.
- `src/sections/home/` — `PostSection` adopts `useBodyScrollLock`; `CrazyAboutSection` deleted; `ProfileSection.test.tsx` and `ProjectsSection.test.tsx` added.
- `src/utils/` — `placeholders.ts` and `imageFallback.ts` added; `converter.ts` deleted.
- `src/design-tokens.ts` — `easings` and `TOAST_VISIBLE_MS` added.
- `src/pages/ProjectDetailPage.tsx` — adopts `createImageFallbackHandler` with `onAfter` callback.

## Conventions doc

See `docs/conventions/shared-primitives.md` (Phase 5 deliverable) — when to reach for `Chip` vs raw `<span>`, when `ModalShell` is the right shell, body-scroll-lock pairing rules, the `placehold.co` host policy. CLAUDE.md auto-references the conventions doc so future feature work loads it into context.
