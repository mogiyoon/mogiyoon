import React from 'react';

export const DetailIcon: React.FC<{ iconKey?: string }> = ({ iconKey }) => {
  if (!iconKey) return null;

  if (iconKey === 'unity') {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-content text-base font-black text-surface shadow-sm">
        U
      </div>
    );
  }

  if (iconKey === 'blender') {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-accent-600 text-base font-black text-surface shadow-sm">
        B
      </div>
    );
  }

  return null;
};

export const GroupIcon: React.FC<{ index: number }> = ({ index }) => {
  const iconClass = 'h-3.5 w-3.5';

  if (index === 0) {
    return (
      <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M5.5 3.75V12.25L12.25 8L5.5 3.75Z" fill="currentColor" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M3 5.25H13M5.25 5.25V3M3 10.75H13M10.75 10.75V13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M3.5 8.25L6.5 11.25L12.75 4.75"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg className={iconClass} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.25 5.5L8 2.75L12.75 5.5V10.5L8 13.25L3.25 10.5V5.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 5.75L8 8.25L12.5 5.75M8 8.25V13"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CloseIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ChevronIcon: React.FC<{ expanded: boolean }> = ({ expanded }) => (
  <svg
    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4 6L8 10L12 6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const InlineArrowIcon: React.FC = () => (
  <svg
    className="mx-1 h-4 w-4 text-accent-500"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 8H13M13 8L9 4M13 8L9 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
