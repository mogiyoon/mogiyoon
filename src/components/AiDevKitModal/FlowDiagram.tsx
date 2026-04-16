import React from 'react';
import type { AiDevKitFlowLoop, AiDevKitStepDetail } from './types';

interface FlowStep {
  // index is zero-based and always points back to the original steps array.
  step: string;
  index: number;
  detail?: AiDevKitStepDetail;
}

interface FlowDiagramProps {
  idBase: string;
  steps: string[];
  loops?: AiDevKitFlowLoop[];
  stepDetails?: AiDevKitStepDetail[];
}

type FlowBlock =
  // Desktop layout is built from top-level blocks: normal step cards or one loop cluster.
  | {
      type: 'step';
      width: number;
      stepItem: FlowStep;
    }
  | {
      type: 'loop';
      width: number;
      stepItem: null;
    };

const STEP_WIDTH = 190;
const STEP_HEIGHT = 150;
const LOOP_CARD_WIDTH = 190;
const LOOP_CARD_HEIGHT = 136;
const LOOP_BLOCK_WIDTH = 620;
const BLOCK_GAP = 52;
const OUTER_ARROW_PADDING = 24;
const LOOP_ARROW_PADDING = 112;
const MIN_ARROW_SEGMENT = 18;
const readableTextStyle: React.CSSProperties = {
  wordBreak: 'keep-all',
  overflowWrap: 'anywhere',
};

// Convert plain step labels into objects that remember their original step number.
const toStepItems = (
  steps: string[],
  offset = 0,
  stepDetails: AiDevKitStepDetail[] = []
): FlowStep[] =>
  steps.map((step, index) => ({
    step,
    index: index + offset,
    detail: stepDetails[index + offset],
  }));

const sanitizeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '-');

// Draw a straight arrow between two points, then trim both ends so the arrow sits in the gap.
const getArrowPath = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  startPadding = 46,
  endPadding = 46
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

// Hand-tuned positions keep common loop sizes readable without pulling in a graph layout library.
const getLoopNodePositions = (loopSize: number, loopBlockHeight: number) => {
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

// Mobile uses the same step semantics, but renders the linear flow vertically.
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

// Main-line cards are shared by desktop and mobile.
const FlowStepCard: React.FC<{
  item: FlowStep;
  highlighted?: boolean;
  className?: string;
  style?: React.CSSProperties;
}> = ({ item, highlighted = false, className = '', style }) => (
  <div
    className={`${className} flex min-h-[132px] flex-col items-center justify-center rounded-card px-4 py-3 text-center ${
      highlighted
        ? 'border-2 border-accent-100 bg-accent-50'
        : 'border border-line/70 bg-surface'
    }`}
    style={style}
  >
    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-700">
      Step {item.index + 1}
    </span>
    {item.detail?.actor && (
      <span
        className="mt-1 max-w-full rounded-full bg-surface px-2 py-0.5 text-[10px] font-bold text-accent-700"
        style={readableTextStyle}
      >
        {item.detail.actor}
      </span>
    )}
    <span className="mt-1 text-sm font-bold text-content" style={readableTextStyle}>
      {item.step}
    </span>
    {item.detail?.action && (
      <span
        className="mt-1 text-[11px] font-medium leading-snug text-content-secondary"
        style={readableTextStyle}
      >
        {item.detail.action}
      </span>
    )}
  </div>
);

// Loop cards are smaller because several of them need to fit inside one cluster.
const LoopStepCard: React.FC<{
  item: FlowStep;
  className?: string;
  style?: React.CSSProperties;
}> = ({ item, className = '', style }) => (
  <div
    className={`${className} flex flex-col items-center justify-center rounded-card border-2 border-accent-100 bg-accent-50 px-3 py-2.5 text-center`}
    style={style}
  >
    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-700">
      Step {item.index + 1}
    </span>
    {item.detail?.actor && (
      <span
        className="mt-0.5 max-w-full rounded-full bg-surface px-1.5 py-0.5 text-[9px] font-bold text-accent-700"
        style={readableTextStyle}
      >
        {item.detail.actor}
      </span>
    )}
    <span
      className="mt-0.5 text-xs font-bold leading-tight text-content"
      style={readableTextStyle}
    >
      {item.step}
    </span>
    {item.detail?.action && (
      <span
        className="mt-0.5 text-[10px] font-medium leading-tight text-content-secondary"
        style={readableTextStyle}
      >
        {item.detail.action}
      </span>
    )}
  </div>
);

// Keep loop explanations close to the diagram without coupling them to the SVG layout.
const LoopLabels: React.FC<{ loops: AiDevKitFlowLoop[] }> = ({ loops }) => {
  const labelledLoops = loops.filter((loop) => loop.label);

  if (labelledLoops.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      {labelledLoops.map((loop, index) => (
        <p
          key={`${loop.fromStep}-${loop.toStep}-${index}`}
          className="flex items-start gap-2 text-xs font-medium leading-relaxed text-content-secondary"
        >
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-600 text-surface">
            <svg
              className="h-2.5 w-2.5"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4.5 5.5H2.5V3.5M2.75 5.25C3.7 3.8 5.23 3 7 3C9.76 3 12 5.24 12 8M11.5 10.5H13.5V12.5M13.25 10.75C12.3 12.2 10.77 13 9 13C6.24 13 4 10.76 4 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {loop.label}
        </p>
      ))}
    </div>
  );
};

const FlowDiagram: React.FC<FlowDiagramProps> = ({
  idBase,
  steps,
  loops = [],
  stepDetails = [],
}) => {
  // Ignore loop metadata that points outside the available step list.
  const validLoops = loops.filter(
    (loop) =>
      loop.fromStep >= 1 &&
      loop.fromStep <= steps.length &&
      loop.toStep >= 1 &&
      loop.toStep <= steps.length
  );
  // The first backward edge defines the visible circular loop cluster.
  const primaryLoop = validLoops.find((loop) => loop.fromStep > loop.toStep);
  const hasCircularLoop = primaryLoop !== undefined;
  const linearSteps = toStepItems(steps, 0, stepDetails);

  if (steps.length === 0) return null;

  const loopStartIndex = primaryLoop ? primaryLoop.toStep - 1 : -1;
  const loopEndIndex = primaryLoop ? primaryLoop.fromStep - 1 : -1;
  // A loop like 2 -> 3 -> 4 -> 2 is rendered as one circular block containing steps 2..4.
  const loopStepItems = hasCircularLoop
    ? steps
        .slice(loopStartIndex, loopEndIndex + 1)
        .map((step, offset) => ({
          step,
          index: loopStartIndex + offset,
          detail: stepDetails[loopStartIndex + offset],
        }))
    : [];
  const preLoopSteps = hasCircularLoop
    ? toStepItems(steps.slice(0, loopStartIndex), 0, stepDetails)
    : [];
  // Steps after the circular block stay in the main line after the loop cluster.
  const postLoopSteps = hasCircularLoop
    ? toStepItems(steps.slice(loopEndIndex + 1), loopEndIndex + 1, stepDetails)
    : [];
  // Highlight loop members in both the desktop and mobile render paths.
  const loopStepIndexes = new Set<number>(
    hasCircularLoop
      ? loopStepItems.map(({ index }) => index)
      : validLoops.flatMap((loop) => [loop.fromStep - 1, loop.toStep - 1])
  );
  const loopBlockHeight = loopStepItems.length >= 4 ? 580 : 430;
  const flowHeight = hasCircularLoop ? loopBlockHeight : STEP_HEIGHT;
  const flowCenter = {
    x: 0,
    y: flowHeight / 2,
  };
  // The desktop flow treats the loop as one block between pre-loop and post-loop steps.
  const flowBlocks: FlowBlock[] = hasCircularLoop
    ? [
        ...preLoopSteps.map((stepItem) => ({
          type: 'step' as const,
          width: STEP_WIDTH,
          stepItem,
        })),
        {
          type: 'loop' as const,
          width: LOOP_BLOCK_WIDTH,
          stepItem: null,
        },
        ...postLoopSteps.map((stepItem) => ({
          type: 'step' as const,
          width: STEP_WIDTH,
          stepItem,
        })),
      ]
    : linearSteps.map((stepItem) => ({
        type: 'step' as const,
        width: STEP_WIDTH,
        stepItem,
      }));
  // Absolute x positions are easier than nested flex when SVG arrows must align with cards.
  const blockLefts = flowBlocks.reduce<number[]>((lefts, _, index) => {
    const previousLeft = lefts[index - 1] ?? 0;
    const previousWidth = flowBlocks[index - 1]?.width ?? 0;

    lefts.push(index === 0 ? 0 : previousLeft + previousWidth + BLOCK_GAP);
    return lefts;
  }, []);
  const totalWidth =
    flowBlocks.length > 0
      ? blockLefts[blockLefts.length - 1] +
        flowBlocks[flowBlocks.length - 1].width
      : 0;
  // If there is a loop block, all loop-card coordinates are offset by this left position.
  const loopBlockIndex = flowBlocks.findIndex((block) => block.type === 'loop');
  const loopBlockLeft = loopBlockIndex >= 0 ? blockLefts[loopBlockIndex] : 0;
  const loopNodePositions = getLoopNodePositions(
    loopStepItems.length,
    loopBlockHeight
  );
  const arrowMarkerId = sanitizeId(`flow-arrow-${idBase}`);
  const innerArrowMarkerId = sanitizeId(`flow-inner-arrow-${idBase}`);
  const stepTop = (flowHeight - STEP_HEIGHT) / 2;
  // Local loop-node positions become absolute SVG coordinates when includeBlockOffset is true.
  const loopNodeCenter = (localIndex: number, includeBlockOffset = true) => {
    const position = loopNodePositions[localIndex] ?? loopNodePositions[0] ?? {
      left: 0,
      top: 0,
    };
    const offsetX = includeBlockOffset ? loopBlockLeft : 0;

    return {
      x: offsetX + position.left + LOOP_CARD_WIDTH / 2,
      y: position.top + LOOP_CARD_HEIGHT / 2,
    };
  };
  // External arrows should live in the blank gap between cards.
  // Use loop-card edges here, not loop-card centers, so arrowheads do not hide under cards.
  const loopNodeBox = (localIndex: number, includeBlockOffset = true) => {
    const position = loopNodePositions[localIndex] ?? loopNodePositions[0] ?? {
      left: 0,
      top: 0,
    };
    const offsetX = includeBlockOffset ? loopBlockLeft : 0;
    const left = offsetX + position.left;
    const top = position.top;

    return {
      left,
      right: left + LOOP_CARD_WIDTH,
      top,
      bottom: top + LOOP_CARD_HEIGHT,
      centerX: left + LOOP_CARD_WIDTH / 2,
      centerY: top + LOOP_CARD_HEIGHT / 2,
    };
  };
  // The exit arrow should read as "next step after the loop", not as "from the loop center".
  // For 2 -> 3 -> 4 -> 2 followed by 5, the outgoing edge starts at step 3 and points to 5.
  const loopExitLocalIndex = Math.max(
    0,
    Math.min(loopStepItems.length - 1, loopEndIndex - loopStartIndex - 1)
  );

  return (
    <>
      {/* Desktop: positioned cards with SVG arrows behind them. */}
      <div className="hidden md:block">
        <div className="overflow-x-auto pb-2">
          <div
            className="relative mx-auto min-w-max"
            style={{
              width: `${totalWidth}px`,
              height: `${flowHeight}px`,
            }}
          >
            <svg
              className="pointer-events-none absolute left-0 top-0 z-0 text-accent-500"
              width={totalWidth}
              height={flowHeight}
              viewBox={`0 0 ${totalWidth} ${flowHeight}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id={arrowMarkerId}
                  markerWidth="5"
                  markerHeight="5"
                  refX="4"
                  refY="2.5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M 0 0 L 5 2.5 L 0 5 Z" fill="currentColor" />
                </marker>
                <marker
                  id={innerArrowMarkerId}
                  markerWidth="6"
                  markerHeight="6"
                  refX="5.4"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M 0 0 L 6 3 L 0 6 Z" fill="currentColor" />
                </marker>
              </defs>

              {/* Top-level arrows connect step blocks and the loop cluster in reading order. */}
              {flowBlocks.slice(0, -1).map((block, blockIndex) => {
                const nextBlock = flowBlocks[blockIndex + 1];
                const currentLeft = blockLefts[blockIndex];
                const nextLeft = blockLefts[blockIndex + 1];
                // External edges attach to the semantically relevant loop step:
                // previous step -> first loop step, and loop exit step -> next step.
                const entryLoopBox = loopNodeBox(0);
                const exitLoopBox = loopNodeBox(loopExitLocalIndex);
                const from =
                  block.type === 'loop'
                    ? {
                        x: exitLoopBox.right,
                        y: exitLoopBox.centerY,
                      }
                    : {
                        x: currentLeft + block.width,
                        y: flowCenter.y,
                      };
                const to =
                  nextBlock.type === 'loop'
                    ? {
                        x: entryLoopBox.left,
                        y: entryLoopBox.centerY,
                      }
                    : {
                        x: nextLeft,
                        y: flowCenter.y,
                      };

                return (
                  <path
                    key={`${idBase}-block-arrow-${blockIndex}`}
                    d={getArrowPath(
                      from,
                      to,
                      OUTER_ARROW_PADDING,
                      OUTER_ARROW_PADDING
                    )}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    markerEnd={`url(#${arrowMarkerId})`}
                  />
                );
              })}

              {/* Internal loop arrows connect the cards inside the circular cluster. */}
              {hasCircularLoop &&
                loopStepItems.map((_, localIndex) => {
                  const nextIndex = (localIndex + 1) % loopStepItems.length;

                  return (
                    <path
                      key={`${idBase}-loop-arrow-${localIndex}`}
                      d={getArrowPath(
                        loopNodeCenter(localIndex),
                        loopNodeCenter(nextIndex),
                        LOOP_ARROW_PADDING,
                        LOOP_ARROW_PADDING
                      )}
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      markerEnd={`url(#${innerArrowMarkerId})`}
                    />
                  );
                })}
            </svg>

            {/* Cards sit above the SVG so arrow lines never cover text. */}
            <div className="absolute inset-0 z-10">
              {flowBlocks.map((block, blockIndex) => {
                if (block.type !== 'step') return null;

                return (
                  <FlowStepCard
                    key={`${idBase}-main-${block.stepItem.index}`}
                    item={block.stepItem}
                    highlighted={loopStepIndexes.has(block.stepItem.index)}
                    className="absolute"
                    style={{
                      left: `${blockLefts[blockIndex]}px`,
                      top: `${stepTop}px`,
                      width: `${STEP_WIDTH}px`,
                      height: `${STEP_HEIGHT}px`,
                    }}
                  />
                );
              })}

              {hasCircularLoop &&
                loopStepItems.map((item, localIndex) => {
                  const position = loopNodePositions[localIndex];

                  return (
                    <LoopStepCard
                      key={`${idBase}-loop-node-${item.index}`}
                      item={item}
                      className="absolute"
                      style={{
                        left: `${loopBlockLeft + position.left}px`,
                        top: `${position.top}px`,
                        width: `${LOOP_CARD_WIDTH}px`,
                        height: `${LOOP_CARD_HEIGHT}px`,
                      }}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: same flow semantics, but stacked around a horizontally scrollable loop cluster. */}
      <div className="flex flex-col gap-2 md:hidden">
        {hasCircularLoop ? (
          <>
            {preLoopSteps.map((item) => (
              <React.Fragment key={`${idBase}-mobile-pre-${item.index}`}>
                <FlowStepCard item={item} />
                <DownArrow />
              </React.Fragment>
            ))}

            <div className="overflow-x-auto pb-1">
              <div
                className="relative mx-auto"
                style={{
                  width: `${LOOP_BLOCK_WIDTH}px`,
                  height: `${loopBlockHeight}px`,
                }}
              >
                <svg
                  className="pointer-events-none absolute left-0 top-0 z-0 text-accent-500"
                  width={LOOP_BLOCK_WIDTH}
                  height={loopBlockHeight}
                  viewBox={`0 0 ${LOOP_BLOCK_WIDTH} ${loopBlockHeight}`}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <marker
                      id={`${innerArrowMarkerId}-mobile`}
                      markerWidth="6"
                      markerHeight="6"
                      refX="5.4"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <path d="M 0 0 L 6 3 L 0 6 Z" fill="currentColor" />
                    </marker>
                  </defs>
                  {loopStepItems.map((_, localIndex) => {
                    const nextIndex = (localIndex + 1) % loopStepItems.length;

                    return (
                      <path
                        key={`${idBase}-mobile-loop-arrow-${localIndex}`}
                        d={getArrowPath(
                          loopNodeCenter(localIndex, false),
                          loopNodeCenter(nextIndex, false),
                          LOOP_ARROW_PADDING,
                          LOOP_ARROW_PADDING
                        )}
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        markerEnd={`url(#${innerArrowMarkerId}-mobile)`}
                      />
                    );
                  })}
                </svg>

                <div className="absolute inset-0 z-10">
                  {loopStepItems.map((item, localIndex) => {
                    const position = loopNodePositions[localIndex];

                    return (
                      <LoopStepCard
                        key={`${idBase}-mobile-loop-node-${item.index}`}
                        item={item}
                        className="absolute"
                        style={{
                          left: `${position.left}px`,
                          top: `${position.top}px`,
                          width: `${LOOP_CARD_WIDTH}px`,
                          height: `${LOOP_CARD_HEIGHT}px`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {postLoopSteps.map((item, index) => (
              <React.Fragment key={`${idBase}-mobile-post-${item.index}`}>
                <DownArrow />
                <FlowStepCard item={item} />
                {index < postLoopSteps.length - 1 && <DownArrow />}
              </React.Fragment>
            ))}
          </>
        ) : (
          linearSteps.map((item, index) => (
            <React.Fragment key={`${idBase}-mobile-linear-${item.index}`}>
              <FlowStepCard
                item={item}
                highlighted={loopStepIndexes.has(item.index)}
              />
              {index < linearSteps.length - 1 && <DownArrow />}
            </React.Fragment>
          ))
        )}
      </div>

      <LoopLabels loops={validLoops} />
    </>
  );
};

export default FlowDiagram;
