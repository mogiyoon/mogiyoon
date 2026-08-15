import React, { useMemo, useState } from 'react';

import Chip from './primitives/Chip';

interface TechStackFilterCardProps {
    title: string;
    searchPlaceholder: string;
    emptyText: string;
    stacks: string[];
    selectedStacks: Set<string>;
    onToggleStack: (stack: string) => void;
}

const TechStackFilterCard: React.FC<TechStackFilterCardProps> = ({
    title,
    searchPlaceholder,
    emptyText,
    stacks,
    selectedStacks,
    onToggleStack,
}) => {
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
            <div className="mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-content-muted">
                    Tech Stack
                </span>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                    <h3 className="text-lg font-bold text-title">
                        {title}
                    </h3>
                </div>
            </div>
            <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="w-full rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-content-strong placeholder:text-content-muted focus:border-accent-500 focus:outline-none"
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
        </div>
    );
};

export default TechStackFilterCard;
