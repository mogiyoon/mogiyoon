import type { MotionProps } from 'framer-motion';

/**
 * AnimatePresence 안의 `motion.div` 에 펴고-접는 세로 컬랩스 애니메이션을 적용하기 위한
 * MotionProps 프리셋. height 0 ↔ auto + opacity 0 ↔ 1 + overflow:hidden.
 *
 * 사용 패턴이 6+ 사이트에서 거의 동일하게 반복되어 묶음 (WorkBlock 의 work / dev / ai 섹션,
 * Dev/AI 하이라이트 상세 펼침).
 *
 * 컴포넌트로 래핑하지 않고 props 만 묶은 이유: framer-motion 의 AnimatePresence 는
 * 직속 자식이 motion.* 이어야 exit 애니메이션이 동작한다. 래퍼를 두면 forwardRef 등
 * 추가 처리가 필요하므로 spread 패턴이 가장 안전하고 가벼움.
 *
 * @example
 * <AnimatePresence initial={false}>
 *   {isOpen && (
 *     <motion.div key="body" {...collapseVerticalPreset(0.28)}>
 *       {body}
 *     </motion.div>
 *   )}
 * </AnimatePresence>
 */
export const collapseVerticalPreset = (duration: number = 0.25): MotionProps => ({
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration, ease: 'easeInOut' },
  style: { overflow: 'hidden' },
});
