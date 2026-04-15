import React from 'react';

interface FlowLoop {
  // Locale data uses 1-based step numbers, so conversion happens inside FlowDiagram.
  fromStep: number;
  toStep: number;
  label?: string;
}

interface FlowStep {
  // index is zero-based and always points back to the original steps array.
  step: string;
  index: number;
}

interface FlowDiagramProps {
  idBase: string;
  steps: string[];
  loops?: FlowLoop[];
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

const STEP_WIDTH = 144;
const STEP_HEIGHT = 86;
const LOOP_CARD_WIDTH = 112;
const LOOP_CARD_HEIGHT = 54;
const LOOP_BLOCK_WIDTH = 300;
const BLOCK_GAP = 52;

// Convert plain step labels into objects that remember their original step number.
const toStepItems = (steps: string[], offset = 0): FlowStep[] =>
  steps.map((step, index) => ({
    step,
    index: index + offset,
  }));

const sanitizeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '-');

// Draw a straight arrow between two centers, trimming each end so it touches card edges.
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

  return `M ${from.x + ux * startPadding} ${from.y + uy * startPadding} L ${
    to.x - ux * endPadding
  } ${to.y - uy * endPadding}`;
};

// Hand-tuned positions keep common loop sizes readable without pulling in a graph layout library.
const getLoopNodePositions = (loopSize: number, loopBlockHeight: number) => {
  if (loopSize === 2) {
    return [
      { left: 34, top: 94 },
      { left: 154, top: 94 },
    ];
  }

  if (loopSize === 3) {
    return [
      { left: 24, top: 58 },
      { left: 164, top: 58 },
      { left: 94, top: 162 },
    ];
  }

  if (loopSize === 4) {
    return [
      { left: 24, top: 112 },
      { left: 94, top: 28 },
      { left: 164, top: 112 },
      { left: 94, top: 198 },
    ];
  }

  const centerX = LOOP_BLOCK_WIDTH / 2 - LOOP_CARD_WIDTH / 2;
  const centerY = loopBlockHeight / 2 - LOOP_CARD_HEIGHT / 2;
  const radiusX = 92;
  const radiusY = 86;

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
    className={`${className} flex flex-col items-center justify-center rounded-card px-3 py-3 text-center ${
      highlighted
        ? 'border-2 border-accent-300 bg-accent-50'
        : 'border border-line bg-surface-subtle'
    }`}
    style={style}
  >
    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-700">
      Step {item.index + 1}
    </span>
    <span className="mt-1 text-sm font-bold text-content">{item.step}</span>
  </div>
);

// Loop cards are smaller because several of them need to fit inside one cluster.
const LoopStepCard: React.FC<{
  item: FlowStep;
  className?: string;
  style?: React.CSSProperties;
}> = ({ item, className = '', style }) => (
  <div
    className={`${className} flex flex-col items-center justify-center rounded-card border-2 border-accent-300 bg-accent-50 px-2.5 py-2 text-center`}
    style={style}
  >
    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-700">
      Step {item.index + 1}
    </span>
    <span className="mt-0.5 text-xs font-bold leading-tight text-content">
      {item.step}
    </span>
  </div>
);

// Keep loop explanations close to the diagram without coupling them to the SVG layout.
const LoopLabels: React.FC<{ loops: FlowLoop[] }> = ({ loops }) => {
  const labelledLoops = loops.filter((loop) => loop.label);

  if (labelledLoops.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      {labelledLoops.map((loop, index) => (
        <p
          key={`${loop.fromStep}-${loop.toStep}-${index}`}
          className="flex items-start gap-2 text-xs font-medium leading-relaxed text-content-secondary"
        >
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-600 text-white">
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

const FlowDiagram: React.FC<FlowDiagramProps> = ({ idBase, steps, loops = [] }) => {
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
  const linearSteps = toStepItems(steps);

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
        }))
    : [];
  const preLoopSteps = hasCircularLoop
    ? toStepItems(steps.slice(0, loopStartIndex))
    : [];
  // Steps after the circular block stay in the main line after the loop cluster.
  const postLoopSteps = hasCircularLoop
    ? toStepItems(steps.slice(loopEndIndex + 1), loopEndIndex + 1)
    : [];
  // Highlight loop members in both the desktop and mobile render paths.
  const loopStepIndexes = new Set<number>(
    hasCircularLoop
      ? loopStepItems.map(({ index }) => index)
      : validLoops.flatMap((loop) => [loop.fromStep - 1, loop.toStep - 1])
  );
  const loopBlockHeight = loopStepItems.length >= 4 ? 280 : 240;
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
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M 0 0 L 8 4 L 0 8 Z" fill="currentColor" />
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
                const from =
                  block.type === 'loop'
                    ? loopNodeCenter(loopExitLocalIndex)
                    : {
                        x: currentLeft + block.width,
                        y: flowCenter.y,
                      };
                const to =
                  nextBlock.type === 'loop'
                    ? loopNodeCenter(0)
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
                      block.type === 'loop' ? 56 : 6,
                      nextBlock.type === 'loop' ? 56 : 6
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
                        50,
                        50
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
                    className="absolute w-36"
                    style={{
                      left: `${blockLefts[blockIndex]}px`,
                      top: `${stepTop}px`,
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
                          50,
                          50
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
