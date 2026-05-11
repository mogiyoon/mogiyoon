import React from 'react';
import { motion } from 'framer-motion';

export type RotatingChevronSize = 'xs' | 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<RotatingChevronSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export interface RotatingChevronProps {
  isRotated: boolean;
  size?: RotatingChevronSize;
  duration?: number;
  strokeWidth?: number;
  className?: string;
}

/**
 * 아래쪽을 가리키는 chevron 아이콘으로, isRotated 가 true 면 180도 회전한다.
 *
 * 아코디언 / 토글 버튼의 펼침-접힘 표시에 사용한다. 코드베이스에서 동일한 패턴이
 * 7군데 이상 반복되어 추출됨. 색상은 부모의 text-* 클래스를 currentColor 로 상속한다.
 */
const RotatingChevron: React.FC<RotatingChevronProps> = ({
  isRotated,
  size = 'sm',
  duration = 0.18,
  strokeWidth = 2,
  className = '',
}) => {
  return (
    <motion.svg
      animate={{ rotate: isRotated ? 180 : 0 }}
      transition={{ duration }}
      className={`${SIZE_CLASSES[size]} ${className}`.trim()}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </motion.svg>
  );
};

export default RotatingChevron;
