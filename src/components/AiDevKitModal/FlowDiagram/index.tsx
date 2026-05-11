import React from 'react';
import {
  BLOCK_GAP,
  LOOP_ARROW_PADDING,
  LOOP_BLOCK_WIDTH,
  LOOP_CARD_HEIGHT,
  LOOP_CARD_WIDTH,
  OUTER_ARROW_PADDING,
  STEP_HEIGHT,
  STEP_WIDTH,
} from './constants';
import {
  getArrowPath,
  getLoopNodePositions,
  sanitizeId,
  toStepItems,
} from './layout';
import type { FlowBlock, FlowDiagramProps } from './types';
import DownArrow from './DownArrow';
import FlowStepCard from './FlowStepCard';
import LoopStepCard from './LoopStepCard';
import LoopLabels from './LoopLabels';

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
      loop.toStep <= steps.length,
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
      : validLoops.flatMap((loop) => [loop.fromStep - 1, loop.toStep - 1]),
  );
  const loopBlockHeight = loopStepItems.length >= 4 ? 580 : 430;
  const flowHeight = hasCircularLoop ? loopBlockHeight : STEP_HEIGHT;
  const flowCenter = { x: 0, y: flowHeight / 2 };
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
      ? blockLefts[blockLefts.length - 1] + flowBlocks[flowBlocks.length - 1].width
      : 0;
  // If there is a loop block, all loop-card coordinates are offset by this left position.
  const loopBlockIndex = flowBlocks.findIndex((block) => block.type === 'loop');
  const loopBlockLeft = loopBlockIndex >= 0 ? blockLefts[loopBlockIndex] : 0;
  const loopNodePositions = getLoopNodePositions(loopStepItems.length, loopBlockHeight);
  const arrowMarkerId = sanitizeId(`flow-arrow-${idBase}`);
  const innerArrowMarkerId = sanitizeId(`flow-inner-arrow-${idBase}`);
  const stepTop = (flowHeight - STEP_HEIGHT) / 2;
  // Local loop-node positions become absolute SVG coordinates when includeBlockOffset is true.
  const loopNodeCenter = (localIndex: number, includeBlockOffset = true) => {
    const position = loopNodePositions[localIndex] ?? loopNodePositions[0] ?? { left: 0, top: 0 };
    const offsetX = includeBlockOffset ? loopBlockLeft : 0;

    return {
      x: offsetX + position.left + LOOP_CARD_WIDTH / 2,
      y: position.top + LOOP_CARD_HEIGHT / 2,
    };
  };
  // External arrows should live in the blank gap between cards.
  // Use loop-card edges here, not loop-card centers, so arrowheads do not hide under cards.
  const loopNodeBox = (localIndex: number, includeBlockOffset = true) => {
    const position = loopNodePositions[localIndex] ?? loopNodePositions[0] ?? { left: 0, top: 0 };
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
    Math.min(loopStepItems.length - 1, loopEndIndex - loopStartIndex - 1),
  );

  return (
    <>
      {/* Desktop: positioned cards with SVG arrows behind them. */}
      <div className="hidden md:block">
        <div className="overflow-x-auto pb-2">
          <div
            className="relative mx-auto min-w-max"
            style={{ width: `${totalWidth}px`, height: `${flowHeight}px` }}
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
                    ? { x: exitLoopBox.right, y: exitLoopBox.centerY }
                    : { x: currentLeft + block.width, y: flowCenter.y };
                const to =
                  nextBlock.type === 'loop'
                    ? { x: entryLoopBox.left, y: entryLoopBox.centerY }
                    : { x: nextLeft, y: flowCenter.y };

                return (
                  <path
                    key={`${idBase}-block-arrow-${blockIndex}`}
                    d={getArrowPath(from, to, OUTER_ARROW_PADDING, OUTER_ARROW_PADDING)}
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
                        LOOP_ARROW_PADDING,
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
                style={{ width: `${LOOP_BLOCK_WIDTH}px`, height: `${loopBlockHeight}px` }}
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
                          LOOP_ARROW_PADDING,
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
              <FlowStepCard item={item} highlighted={loopStepIndexes.has(item.index)} />
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
