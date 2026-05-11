import type { AiDevKitStepDetail } from '../types';
import {
  LOOP_BLOCK_WIDTH,
  LOOP_CARD_HEIGHT,
  LOOP_CARD_WIDTH,
  MIN_ARROW_SEGMENT,
} from './constants';
import type { FlowStep } from './types';

/** 평문 step 라벨을 원본 인덱스 + detail 까지 묶어 FlowStep 으로 변환한다. */
export const toStepItems = (
  steps: string[],
  offset = 0,
  stepDetails: AiDevKitStepDetail[] = [],
): FlowStep[] =>
  steps.map((step, index) => ({
    step,
    index: index + offset,
    detail: stepDetails[index + offset],
  }));

/** SVG marker id 등으로 쓰일 수 있도록 ASCII-safe 한 문자열로 변환. */
export const sanitizeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '-');

/**
 * 두 점 사이를 잇는 직선 화살표 path 를 만들고, 양쪽 끝을 padding 만큼 줄여서
 * 화살촉이 카드 안에 묻히지 않도록 한다.
 */
export const getArrowPath = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  startPadding = 46,
  endPadding = 46,
) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const maxPadding = Math.max(0, (length - MIN_ARROW_SEGMENT) / 2);
  const safeStartPadding = Math.min(startPadding, maxPadding);
  const safeEndPadding = Math.min(endPadding, maxPadding);

  return `M ${from.x + ux * safeStartPadding} ${
    from.y + uy * safeStartPadding
  } L ${to.x - ux * safeEndPadding} ${to.y - uy * safeEndPadding}`;
};

/**
 * 흔한 loop 크기 (2/3/4) 에 대해 손으로 튜닝된 좌표를 반환한다. 그 외에는
 * 타원 분포로 자동 배치해 그래프 라이브러리를 끌어들이지 않고도 가독성을 유지한다.
 */
export const getLoopNodePositions = (loopSize: number, loopBlockHeight: number) => {
  if (loopSize === 2) {
    return [
      { left: 70, top: 147 },
      { left: 360, top: 147 },
    ];
  }

  if (loopSize === 3) {
    return [
      { left: 45, top: 80 },
      { left: 385, top: 80 },
      { left: 215, top: 274 },
    ];
  }

  if (loopSize === 4) {
    return [
      { left: 30, top: 222 },
      { left: 215, top: 26 },
      { left: 400, top: 222 },
      { left: 215, top: 418 },
    ];
  }

  const centerX = LOOP_BLOCK_WIDTH / 2 - LOOP_CARD_WIDTH / 2;
  const centerY = loopBlockHeight / 2 - LOOP_CARD_HEIGHT / 2;
  const radiusX = 205;
  const radiusY = 180;

  return Array.from({ length: loopSize }, (_, index) => {
    const angle = Math.PI + (index / loopSize) * Math.PI * 2;

    return {
      left: centerX + Math.cos(angle) * radiusX,
      top: centerY + Math.sin(angle) * radiusY,
    };
  });
};
