import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Timeline,
    type TimeRange,
    type TimelineItem,
    type TimelineItemRenderContext,
} from '@mogiyoon/react-stable-timeline';

const ms = (iso: string) => new Date(iso).getTime();
const NOW = Date.now();

// ── 데이터 ────────────────────────────────────────────────────────────────────
// 실제 데이터셋: 포트폴리오 프로젝트 + 프로필(경력·학력·수상·자격증) 기간을
// 카테고리 색상으로 구분해 라이브러리에 그대로 입력한다.
type DemoCategory = 'project' | 'work' | 'education' | 'award' | 'certificate';
type DemoItemData = { category: DemoCategory };
type DemoItem = TimelineItem<DemoItemData>;

const CATEGORY_COLORS: Record<DemoCategory, string> = {
    project: '#6366f1',
    work: '#10b981',
    education: '#0ea5e9',
    award: '#f59e0b',
    certificate: '#f43f5e',
};

const CATEGORY_ORDER: DemoCategory[] = ['project', 'work', 'education', 'award', 'certificate'];

const realItem = (
    id: string,
    label: string,
    category: DemoCategory,
    start: string,
    end?: string | 'now'
): DemoItem => ({
    id,
    label,
    start: ms(start),
    end: end === 'now' ? NOW : end ? ms(end) : undefined,
    color: CATEGORY_COLORS[category],
    data: { category },
});

// 경력·학력·수상·자격증 라벨은 introduction 네임스페이스의 기존 번역을 재사용한다.
const buildRealItems = (tIntro: (key: string) => string): DemoItem[] => [
    // 프로젝트 (projects-list 기간 기준)
    realItem('teacher-test', 'Teacher Test', 'project', '2024-01-01', '2024-02-29'),
    realItem('test-maker', 'Test Maker', 'project', '2024-11-01', '2025-02-28'),
    realItem('mrnsg', 'mrnsg', 'project', '2025-01-01', '2025-01-31'),
    realItem('recho', 'Recho', 'project', '2025-06-01', '2025-07-31'),
    realItem('seoul-meari', 'Seoul Meari', 'project', '2025-08-01', '2025-09-30'),
    realItem('boj-snippets', 'BOJ Snippets', 'project', '2026-04-01', '2026-04-30'),
    realItem('react-stable-timeline', '@mogiyoon/react-stable-timeline', 'project', '2026-05-01', '2026-08-31'),
    realItem('storytect', 'Storytect', 'project', '2026-05-01', '2026-05-31'),
    realItem('stock-compass', 'Stock Compass', 'project', '2026-05-01', '2026-05-31'),
    // 경력
    realItem('work-gama', tIntro('work.gamaSchool.title'), 'work', '2023-03-01', '2025-02-28'),
    realItem('work-deeptrade', tIntro('work.deeptrade.title'), 'work', '2025-09-01', 'now'),
    // 학력
    realItem('edu-jeju', tIntro('education.jejuEdu.title'), 'education', '2019-03-01', '2023-02-28'),
    realItem('edu-open-univ', tIntro('education.openUniv.title'), 'education', '2025-03-01', '2027-02-28'),
    // 수상 (단일 시점은 포인트 이벤트)
    realItem('award-jeju-invention', tIntro('awards.jejuInvention.title'), 'award', '2019-11-15'),
    realItem('award-krafton', tIntro('awards.kraftonJungle.title'), 'award', '2025-03-01', '2025-07-31'),
    realItem('award-seoul-ai', tIntro('awards.seoulAiHackathon.title'), 'award', '2025-10-15'),
    // 자격증 (취득 시점 포인트)
    realItem('cert-teacher', tIntro('certificate.teacherCert.title'), 'certificate', '2023-02-15'),
    realItem('cert-info-processing', tIntro('certificate.infoProcessing.title'), 'certificate', '2024-08-15'),
    realItem('cert-sqld', tIntro('certificate.sqld.title'), 'certificate', '2025-12-15'),
];

// 스트레스 데이터셋: 2만 개 항목으로 가상화·행 배치 성능을 확인하는 픽스처.
// 행 배치는 O(n log n) 세그먼트 트리 기준 ~10ms 수준이며, 렌더링은 가상화로 DOM 이 수백 개로 유지됨.
// Math.random 대신 인덱스 기반 결정적 생성 — 재생성 시에도 행 배치가 동일하게 유지됨.
const STRESS_COUNT = 20_000;
const STRESS_LABELS = [
    '배포 준비',
    'Sprint review',
    '한글 라벨 폭 측정',
    'Major release',
    '혼합 Mixed 라벨',
    'Hotfix',
    '마일스톤 점검',
];
const STRESS_COLORS = ['#6366f1', '#10b981', '#0ea5e9', '#f59e0b', '#f43f5e', '#8b5cf6', '#64748b'];

const buildStressItems = (): DemoItem[] => {
    const DAY = 86_400_000;
    const base = ms('2020-01-01');
    const span = ms('2026-12-31') - base;
    const items: DemoItem[] = [];
    for (let i = 0; i < STRESS_COUNT; i++) {
        const start = base + ((i * 977_777) % span);
        const isRange = i % 3 !== 0;
        items.push({
            id: `s-${i}`,
            label: `${STRESS_LABELS[i % STRESS_LABELS.length]} #${i}`,
            start,
            end: isRange ? start + DAY * (1 + (i % 40)) : undefined,
            color: STRESS_COLORS[i % STRESS_COLORS.length],
            data: { category: 'project' },
        });
    }
    return items;
};

// ── 커스텀 renderItem ─────────────────────────────────────────────────────────
// 기본 렌더러 대신 pill 형태로 그리는 대체 렌더러 — renderItem prop 검증용.
// 이동/리사이즈 핸들 props 는 undefined 일 수 있어(해당 콜백 미설정 시) 조건부로 spread.
const renderCustomItem = (ctx: TimelineItemRenderContext<DemoItemData>) => {
    const {
        item, startX, endX, top, isRange, isDragging,
        select, moveHandleProps, resizeStartHandleProps, resizeEndHandleProps,
    } = ctx;
    const color = item.color ?? '#6366f1';

    if (!isRange) {
        return (
            <div
                style={{ position: 'absolute', left: startX, top, transform: 'translateX(-50%)' }}
                className="flex flex-col items-center"
            >
                <button
                    type="button"
                    onClick={select}
                    {...(moveHandleProps ?? {})}
                    aria-label={item.label}
                    style={{ width: 12, height: 12, backgroundColor: color, touchAction: 'none' }}
                    className="rotate-45 rounded-[3px] border border-white shadow cursor-pointer"
                />
                <span className="mt-1 text-[10px] leading-none whitespace-nowrap text-content-secondary">
                    {item.label}
                </span>
            </div>
        );
    }

    return (
        <div
            style={{
                position: 'absolute',
                left: startX,
                top,
                width: Math.max(endX - startX, 12),
                opacity: isDragging ? 0.7 : 1,
            }}
        >
            <div
                onClick={select}
                {...(moveHandleProps ?? {})}
                style={{ backgroundColor: `${color}1f`, borderColor: color, touchAction: 'none' }}
                className="relative flex h-6 items-center overflow-hidden rounded-full border-2 px-2 cursor-pointer"
            >
                <span className="text-[10px] font-semibold whitespace-nowrap" style={{ color }}>
                    {item.label}
                </span>
                {resizeStartHandleProps && (
                    <div
                        {...resizeStartHandleProps}
                        style={{ touchAction: 'none' }}
                        className="absolute left-0 top-0 h-full w-2 cursor-ew-resize"
                    />
                )}
                {resizeEndHandleProps && (
                    <div
                        {...resizeEndHandleProps}
                        style={{ touchAction: 'none' }}
                        className="absolute right-0 top-0 h-full w-2 cursor-ew-resize"
                    />
                )}
            </div>
        </div>
    );
};

// ── 컨트롤 UI ─────────────────────────────────────────────────────────────────
const ToggleButton: React.FC<{
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ active, onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150 ${
            active
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-line bg-surface text-content-secondary hover:bg-surface-subtle'
        }`}
    >
        {children}
    </button>
);

const ControlGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-content-muted">
            {label}
        </span>
        {children}
    </div>
);

type Dataset = 'real' | 'stress';
type SnapMode = 'none' | 'day' | 'week';

const SNAP_MS: Record<SnapMode, number | undefined> = {
    none: undefined,
    day: 86_400_000,
    week: 7 * 86_400_000,
};

interface DemoOptions {
    move: boolean;
    resize: boolean;
    snap: SnapMode;
    zoomStable: boolean;
    hideToolbar: boolean;
    cursor: boolean;
    customRender: boolean;
    virtualization: boolean;
    blurCommit: boolean;
}

const DEFAULT_OPTIONS: DemoOptions = {
    move: false,
    resize: false,
    snap: 'day',
    zoomStable: false,
    hideToolbar: false,
    cursor: true,
    customRender: false,
    virtualization: true,
    blurCommit: false,
};

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
const ReactStableTimelineDemo: React.FC = () => {
    const { t, i18n } = useTranslation(['projects/project-react-stable-timeline', 'introduction']);
    const td = (key: string) => t(`react-stable-timeline.demo.${key}`);

    const [dataset, setDataset] = useState<Dataset>('real');
    const [options, setOptions] = useState<DemoOptions>(DEFAULT_OPTIONS);
    const [edits, setEdits] = useState<Record<string, TimeRange>>({});
    const [selected, setSelected] = useState<DemoItem | null>(null);
    const [viewport, setViewport] = useState<TimeRange | null>(null);

    const toggle = (key: keyof DemoOptions) =>
        setOptions((prev) => ({ ...prev, [key]: !prev[key] }));

    const baseItems = useMemo(() => {
        if (dataset === 'stress') return buildStressItems();
        return buildRealItems((key) => t(key, { ns: 'introduction' }));
        // 언어 변경 시 introduction 라벨 재평가
    }, [dataset, t, i18n.language]);

    // 드래그 이동/리사이즈 결과는 edits 오버레이로 관리 (라이브러리는 controlled — items 를 직접 변경하지 않음)
    const items = useMemo(
        () => baseItems.map((item) => (edits[item.id] ? { ...item, ...edits[item.id] } : item)),
        [baseItems, edits]
    );

    const applyEdit = (item: DemoItem, next: TimeRange) =>
        setEdits((prev) => ({ ...prev, [item.id]: next }));

    const selectDataset = (next: Dataset) => {
        setDataset(next);
        setEdits({});
        setSelected(null);
        // 2만 개에서는 줌 시 행 이동이 어지러우므로 행 고정을 기본으로 켬 (재배치 자체는 ~10ms)
        if (next === 'stress') setOptions((prev) => ({ ...prev, zoomStable: true }));
    };

    const dateFormat = useMemo(
        () =>
            new Intl.DateTimeFormat(i18n.language === 'ko' ? 'ko' : 'en', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }),
        [i18n.language]
    );
    const formatRange = (start: number, end?: number) =>
        end && end !== start
            ? `${dateFormat.format(start)} ~ ${dateFormat.format(end)}`
            : dateFormat.format(start);

    const timelineLabels = useMemo(
        () => ({
            fit: td('labels.fit'),
            zoomIn: td('labels.zoomIn'),
            zoomOut: td('labels.zoomOut'),
            zoomRatio: td('labels.zoomRatio'),
            empty: td('labels.empty'),
            timeline: td('labels.timeline'),
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [t, i18n.language]
    );

    const hasEdits = Object.keys(edits).length > 0;

    return (
        <div className="w-full rounded-modal bg-white shadow-xl border border-line overflow-hidden">
            {/* 데이터셋 선택 + 컨트롤 패널 */}
            <div className="border-b border-line bg-surface-subtle px-4 py-3 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex gap-1.5">
                        <ToggleButton active={dataset === 'real'} onClick={() => selectDataset('real')}>
                            {td('dataset.real')}
                        </ToggleButton>
                        <ToggleButton active={dataset === 'stress'} onClick={() => selectDataset('stress')}>
                            {td('dataset.stress')}
                        </ToggleButton>
                    </div>
                    {hasEdits && (
                        <button
                            type="button"
                            onClick={() => setEdits({})}
                            className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-content-secondary hover:bg-surface-subtle transition-colors duration-150"
                        >
                            {td('reset')}
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <ControlGroup label={td('group.interaction')}>
                        <ToggleButton active={options.move} onClick={() => toggle('move')}>
                            {td('options.move')}
                        </ToggleButton>
                        <ToggleButton active={options.resize} onClick={() => toggle('resize')}>
                            {td('options.resize')}
                        </ToggleButton>
                    </ControlGroup>

                    <ControlGroup label={td('group.snap')}>
                        {(['none', 'day', 'week'] as SnapMode[]).map((mode) => (
                            <ToggleButton
                                key={mode}
                                active={options.snap === mode}
                                onClick={() => setOptions((prev) => ({ ...prev, snap: mode }))}
                            >
                                {td(`options.snap.${mode}`)}
                            </ToggleButton>
                        ))}
                    </ControlGroup>

                    <ControlGroup label={td('group.zoom')}>
                        <ToggleButton active={options.zoomStable} onClick={() => toggle('zoomStable')}>
                            {td('options.zoomStable')}
                        </ToggleButton>
                        <ToggleButton active={options.blurCommit} onClick={() => toggle('blurCommit')}>
                            {td('options.blurCommit')}
                        </ToggleButton>
                    </ControlGroup>

                    <ControlGroup label={td('group.display')}>
                        <ToggleButton active={options.hideToolbar} onClick={() => toggle('hideToolbar')}>
                            {td('options.hideToolbar')}
                        </ToggleButton>
                        <ToggleButton active={options.cursor} onClick={() => toggle('cursor')}>
                            {td('options.cursor')}
                        </ToggleButton>
                        <ToggleButton active={options.customRender} onClick={() => toggle('customRender')}>
                            {td('options.customRender')}
                        </ToggleButton>
                        <ToggleButton active={options.virtualization} onClick={() => toggle('virtualization')}>
                            {td('options.virtualization')}
                        </ToggleButton>
                    </ControlGroup>
                </div>
            </div>

            <Timeline<DemoItemData>
                items={items}
                accentColor="#6366f1"
                style={{ height: 400 }}
                labels={timelineLabels}
                cursorMs={options.cursor ? NOW : null}
                hideToolbar={options.hideToolbar}
                zoomStable={options.zoomStable}
                zoomInputTypingCommit={options.blurCommit ? 'blur' : 'immediate'}
                zoomInputSpinnerCommit={options.blurCommit ? 'blur' : 'immediate'}
                virtualization={options.virtualization}
                dragSnapMs={SNAP_MS[options.snap]}
                onItemMove={options.move ? applyEdit : undefined}
                onItemResize={options.resize ? applyEdit : undefined}
                onSelect={setSelected}
                onViewportChange={(start, end) => setViewport({ start, end })}
                renderItem={options.customRender ? renderCustomItem : undefined}
            />

            {/* 선택 항목 / 뷰포트 / 범례 */}
            <div className="border-t border-line bg-surface-subtle px-4 py-3 space-y-2">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                    <span className="text-content-secondary">
                        <span className="font-semibold text-content-muted uppercase tracking-wider text-[11px] mr-1.5">
                            {td('selected.title')}
                        </span>
                        {selected ? (
                            <>
                                <span
                                    className="inline-block w-2 h-2 rounded-full mr-1 align-middle"
                                    style={{ backgroundColor: selected.color ?? '#6366f1' }}
                                />
                                <span className="font-medium text-content-strong">{selected.label}</span>
                                <span className="text-content-muted ml-1.5">
                                    {formatRange(selected.start, selected.end)}
                                </span>
                                {dataset === 'real' && selected.data && (
                                    <span className="text-content-muted ml-1.5">
                                        · {td(`legend.${selected.data.category}`)}
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-content-muted">{td('selected.empty')}</span>
                        )}
                    </span>
                    {viewport && (
                        <span className="text-content-muted">
                            <span className="font-semibold uppercase tracking-wider text-[11px] mr-1.5">
                                {td('viewport')}
                            </span>
                            {formatRange(viewport.start, viewport.end)}
                        </span>
                    )}
                </div>

                {dataset === 'real' && (
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                        {CATEGORY_ORDER.map((category) => (
                            <span key={category} className="inline-flex items-center gap-1 text-[11px] text-content-muted">
                                <span
                                    className="inline-block w-2 h-2 rounded-full"
                                    style={{ backgroundColor: CATEGORY_COLORS[category] }}
                                />
                                {td(`legend.${category}`)}
                            </span>
                        ))}
                    </div>
                )}

                <p className="text-[11px] text-content-muted">{td('hint')}</p>
            </div>
        </div>
    );
};

export default ReactStableTimelineDemo;
