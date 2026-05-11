import type React from 'react';

export const STEP_WIDTH = 190;
export const STEP_HEIGHT = 150;
export const LOOP_CARD_WIDTH = 190;
export const LOOP_CARD_HEIGHT = 136;
export const LOOP_BLOCK_WIDTH = 620;
export const BLOCK_GAP = 52;
export const OUTER_ARROW_PADDING = 24;
export const LOOP_ARROW_PADDING = 112;
export const MIN_ARROW_SEGMENT = 18;

/** 한글 단어를 깨지 않고 줄바꿈하기 위한 텍스트 스타일. */
export const readableTextStyle: React.CSSProperties = {
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
};
