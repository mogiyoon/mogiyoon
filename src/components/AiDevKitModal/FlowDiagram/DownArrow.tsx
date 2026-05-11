import React from 'react';

/** 모바일 레이아웃에서 step 사이를 잇는 세로 화살표. */
const DownArrow: React.FC = () => (
  <div className="flex items-center justify-center gap-1 text-accent-500">
    <div className="h-4 w-px bg-line" />
    <svg
      className="h-3.5 w-3.5 rotate-90"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 8H13M13 8L9 4M13 8L9 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <div className="h-4 w-px bg-line" />
  </div>
);

export default DownArrow;
