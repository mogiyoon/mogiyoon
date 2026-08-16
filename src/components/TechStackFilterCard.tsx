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
}

const TechStackFilterCard: React.FC<TechStackFilterCardProps> = ({
    title,
    searchPlaceholder,
    emptyText,
    stacks,
    selectedStacks,
    onToggleStack,
    defaultOpen = false,
}) => {
    // 기본 접힘 아코디언 — 필요할 때만 펼쳐서 사용
    const { isOpen, toggle } = useDisclosure(defaultOpen);
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
                onClick={toggle}
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
                    <RotatingChevron isRotated={isOpen} size="md" />
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
                        <div className="mt-3 flex flex-wrap justify-center gap-1.5 lg:justify-start">
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TechStackFilterCard;
