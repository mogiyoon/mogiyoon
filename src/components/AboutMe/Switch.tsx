// Switch.tsx
import { motion } from 'framer-motion';
import { animation } from '../../design-tokens';

interface SwitchProps {
  onClick: () => void;
  /** 표시 트리거 — 스크롤 임계점 통과 시 latch */
  visible: boolean;
  isSwitchedOn: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ onClick, visible, isSwitchedOn }) => {
  return (
    <motion.div
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
    >
      <button
        onClick={onClick}
        className={`w-20 h-10 rounded-full flex items-center p-1 transition-colors duration-300 ${
          isSwitchedOn ? 'bg-yellow-400 justify-end' : 'bg-slate-600 justify-start'
        } cursor-pointer`} // 🔴 disabled 스타일링 제거
      >
        <motion.div
          layout
          className="w-8 h-8 bg-surface rounded-full shadow-md"
          transition={animation.tabSpring}
        />
      </button>
      <span className="text-white text-sm font-semibold tracking-wider">
        {/* 🟡 텍스트를 상태에 따라 변경 */}
        {isSwitchedOn ? 'TURN OFF' : 'TURN ON'}
      </span>
    </motion.div>
  );
};
