import React from 'react';

/**
 * 이력서 빌더 (왼쪽 사이드바) 에서만 쓰이는 인라인 헬퍼 컴포넌트 모음.
 * 일반 primitive 가 아니므로 src/components/primitives 가 아닌 페이지 로컬에 위치한다.
 */

export const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{children}</h2>
);

export const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
    {children}
  </label>
);

export const CollapsibleEditorSection: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => (
  <section className="rounded-paper-edge-lg border border-slate-200 bg-[#f7f8fb] p-4 shadow-lg">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-2.5 text-left"
    >
      <SectionHeading>{title}</SectionHeading>
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
        <svg
          className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
    </button>

    {isOpen && <div className="mt-3">{children}</div>}
  </section>
);

export const CollapsibleSubItem: React.FC<{
  header: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}> = ({ header, isOpen, onToggle, children }) => (
  <div className="rounded-2xl border border-slate-200 bg-white">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-start justify-between gap-2.5 p-3.5 text-left"
    >
      <div className="min-w-0 flex-1">{header}</div>
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
        <svg
          className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
    </button>
    {isOpen && children && <div className="px-3.5 pb-3.5">{children}</div>}
  </div>
);

export const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${props.className ?? ''}`}
  />
);

export const TextAreaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className={`w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 ${props.className ?? ''}`}
  />
);
