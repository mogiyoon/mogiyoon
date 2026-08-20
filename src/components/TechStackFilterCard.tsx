import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useDisclosure } from '../hooks/useDisclosure';
import { collapseVerticalPreset } from '../utils/motionPresets';
import Chip from './primitives/Chip';
import RotatingChevron from './primitives/RotatingChevron';

interface TechStackFilterCardProps {
    title: string;
    searchPlaceholder: string;
    emptyText: string;
    stacks: string[];
    selectedStacks: Set<string>;
    onToggleStack: (stack: string) => void;
    /** true 면 펼친 상태로 시작 (예: 스킬 칩에서 필터가 선택된 채 진입한 경우) */
    defaultOpen?: boolean;
    /** 아코디언 펼침/접힘이 바뀔 때 알림 (사이드바가 플립 프리뷰 카드 숨김에 사용) */
    onOpenChange?: (isOpen: boolean) => void;
}

const TechStackFilterCard: React.FC<TechStackFilterCardProps> = ({
    title,
    searchPlaceholder,
    emptyText,
    stacks,
    selectedStacks,
    onToggleStack,
    defaultOpen = false,
    onOpenChange,
}) => {
    // 기본 접힘 아코디언 — 필요할 때만 펼쳐서 사용
    const { isOpen, toggle } = useDisclosure(defaultOpen);

    const handleToggle = () => {
        onOpenChange?.(!isOpen);
        toggle();
    };
    const [query, setQuery] = useState('');
    const normalizedQuery = query.trim().toLowerCase();

    const visibleStacks = useMemo(
        () =>
            normalizedQuery
                ? stacks.filter((stack) => stack.toLowerCase().includes(normalizedQuery))
                : stacks,
        [stacks, normalizedQuery],
    );

    return (
        <div className="rounded-card bg-surface p-4 shadow-lg sm:p-5">
            {/* AI DevKit 카드와 동일한 정렬 (모바일 가운데, lg 왼쪽) — chevron 은 absolute 로 우측 고정 */}
            <button
                type="button"
                onClick={handleToggle}
                aria-expanded={isOpen}
                className="relative block w-full text-center lg:text-left"
            >
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-content-muted">
                    Tech Stack
                </span>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                    <h3 className="text-lg font-bold text-title">
                        {title}
                    </h3>
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-content-muted">
                    {/* 접힘=위(↑), 펼침=아래(↓) — 사용자 피드백으로 기본 방향을 반전 */}
                    <RotatingChevron isRotated={!isOpen} size="md" />
                </div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div key="body" {...collapseVerticalPreset()}>
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={searchPlaceholder}
                            aria-label={searchPlaceholder}
                            className="mt-4 w-full rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-content-strong placeholder:text-content-muted focus:border-accent-500 focus:outline-none"
                        />
                        {/* 칩 목록이 프로젝트 수에 비례해 자라므로 내부 스크롤로 제한한다.
                            max-h 는 칩 줄 높이에 안 떨어지는 값으로 잡아 마지막 줄이 반쯤 걸쳐 보이게 해
                            스크롤 가능한 영역임이 눈에 보이도록 한다. (sticky 사이드바가 뷰포트를
                            넘어 AI DevKit 카드까지 밀어내던 문제의 해결) */}
                        <div className="mt-3 max-h-52 overflow-y-auto overscroll-contain pr-1">
                            <div className="flex flex-wrap justify-center gap-1.5 lg:justify-start">
                                {visibleStacks.map((stack) => (
                                    <button
                                        key={stack}
                                        type="button"
                                        onClick={() => onToggleStack(stack)}
                                        aria-pressed={selectedStacks.has(stack)}
                                        className="rounded-full"
                                    >
                                        <Chip
                                            tone={selectedStacks.has(stack) ? 'accentSolid' : 'outlined'}
                                            size="md"
                                        >
                                            {stack}
                                        </Chip>
                                    </button>
                                ))}
                                {visibleStacks.length === 0 && (
                                    <p className="text-xs text-content-muted">{emptyText}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TechStackFilterCard;
