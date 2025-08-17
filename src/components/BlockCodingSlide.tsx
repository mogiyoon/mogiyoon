// BlockCodingSlide.tsx (디버깅용 콘솔 로그 추가 버전)

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ... (Block, BlockUI, DraggableBlock, SortableBlock 컴포넌트는 이전과 동일)
interface Block { id: string; text: string; }
const BlockUI: React.FC<{ text: string; isDragging?: boolean }> = React.forwardRef(({ text, isDragging, ...props }, ref) => ( <div ref={ref as React.Ref<HTMLDivElement>} {...props} className={`p-3 mb-2 bg-blue-500 text-white rounded-lg shadow-md select-none ${isDragging ? 'opacity-50' : ''}`}> {text} </div> ));
const DraggableBlock: React.FC<{ block: Block }> = ({ block }) => { const { attributes, listeners, setNodeRef } = useDraggable({ id: block.id, data: { block }, }); return ( <div ref={setNodeRef} {...listeners} {...attributes} className="cursor-grab"> <BlockUI text={block.text} /> </div> ); };
const SortableBlock: React.FC<{ block: Block }> = ({ block }) => { const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = useSortable({ id: block.id }); const style = { transform: CSS.Transform.toString(transform), transition, }; return ( <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing"> <BlockUI text={block.text} isDragging={isDragging} /> </div> ); };


// 메인 컴포넌트
const BlockCodingSlide: React.FC = () => {
  // ... (useState, useEffect 등 상태 관련 코드는 이전과 동일)
  const initialAvailableBlocks: Block[] = [ { id: 'move-right', text: '오른쪽으로 이동 ➡️' }, { id: 'move-left', text: '왼쪽으로 이동 ⬅️' }, { id: 'jump', text: '점프 ⬆️' }, { id: 'wait', text: '1초 대기 ⏳' }, ];
  const [sequenceBlocks, setSequenceBlocks] = useState<Block[]>([]);
  const [characterPos, setCharacterPos] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const { setNodeRef: droppableRef } = useDroppable({ id: 'sequence-area' });
  useEffect(() => { if (isRunning && currentStep < sequenceBlocks.length) { const commandId = sequenceBlocks[currentStep].id.split('-')[0]; const timeout = setTimeout(() => { switch (commandId) { case 'move-right': setCharacterPos(pos => ({ ...pos, x: pos.x + 50 })); break; case 'move-left': setCharacterPos(pos => ({ ...pos, x: pos.x - 50 })); break; case 'jump': setIsJumping(true); setTimeout(() => setIsJumping(false), 500); break; case 'wait': break; } setCurrentStep(step => step + 1); }, 1000); return () => clearTimeout(timeout); } else if (isRunning) { setIsRunning(false); } }, [isRunning, currentStep, sequenceBlocks]);
  const handleRunCode = () => { setCharacterPos({ x: 0, y: 0 }); setCurrentStep(0); setIsRunning(true); };
  const handleReset = () => { setIsRunning(false); setCharacterPos({ x: 0, y: 0 }); setCurrentStep(0); setSequenceBlocks([]); };


  // ⭐️ 디버깅 로그 추가 ⭐️
  const handleDragStart = (event: any) => {
    console.log('%c--- Drag Start ---', 'color: green; font-weight: bold;', event);
    if (event.active.data.current?.block) {
      setActiveBlock(event.active.data.current.block);
    } else {
      const block = sequenceBlocks.find(b => b.id === event.active.id);
      if (block) setActiveBlock(block);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('%c--- Drag End ---', 'color: red; font-weight: bold;', { active, over });
    setActiveBlock(null);

    if (!over) {
        console.log('Drop failed: `over` is null.');
        return;
    }

    // 이하 로직은 이전과 동일
    const isAddingNewBlock = active.data.current?.block;
    if (isAddingNewBlock) {
      const isOverSequenceArea = over.id === 'sequence-area' || sequenceBlocks.some(b => b.id === over.id);
      if (isOverSequenceArea) {
        const newBlock: Block = active.data.current.block;
        const uniqueBlock = { ...newBlock, id: `${newBlock.id}-${Date.now()}` };
        const overIndex = sequenceBlocks.findIndex(b => b.id === over.id);
        if (overIndex !== -1) {
          setSequenceBlocks(current => [...current.slice(0, overIndex), uniqueBlock, ...current.slice(overIndex)]);
        } else {
          setSequenceBlocks(current => [...current, uniqueBlock]);
        }
      }
      return;
    }

    if (active.id !== over.id) {
        const oldIndex = sequenceBlocks.findIndex((b) => b.id === active.id);
        const isOverSortable = sequenceBlocks.some(b => b.id === over.id);
        
        if (isOverSortable) {
            const newIndex = sequenceBlocks.findIndex((b) => b.id === over.id);
            setSequenceBlocks(arrayMove(sequenceBlocks, oldIndex, newIndex));
        } else if (over.id === 'sequence-area') {
            setSequenceBlocks(arrayMove(sequenceBlocks, oldIndex, sequenceBlocks.length - 1));
        }
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      {/* ... (이하 JSX 부분은 이전과 동일) */}
      <div className="w-full max-w-6xl mx-auto p-4 md:p-8 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-bold mb-3 text-gray-700">블록 꾸러미</h3>
            {initialAvailableBlocks.map(block => ( <DraggableBlock key={block.id} block={block} /> ))}
          </div>
          <div ref={droppableRef} className="p-4 bg-white rounded-lg shadow min-h-[200px]">
            <h3 className="font-bold mb-3 text-gray-700">실행 순서</h3>
            <SortableContext items={sequenceBlocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              {sequenceBlocks.map(block => ( <SortableBlock key={block.id} block={block} /> ))}
            </SortableContext>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg shadow flex flex-col justify-between">
            <div>
              <h3 className="font-bold mb-3 text-white">실행 화면</h3>
              <div className="relative w-full h-48 bg-gray-700 rounded overflow-hidden border-2 border-gray-600">
                <div className="absolute bottom-0 w-8 h-8 bg-green-400 rounded-full transition-all duration-500 ease-in-out flex items-center justify-center text-xl" style={{ left: `calc(50% + ${characterPos.x}px)`, bottom: isJumping ? '50px' : '0px', transform: 'translateX(-50%)' }} >🤖</div>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button onClick={handleRunCode} disabled={isRunning} className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded hover:bg-green-600 disabled:bg-gray-500">▶ 시작</button>
              <button onClick={handleReset} className="w-full py-2 px-4 bg-red-500 text-white font-bold rounded hover:bg-red-600">🔄 초기화</button>
            </div>
          </div>
        </div>
      </div>
      <DragOverlay> {activeBlock ? <BlockUI text={activeBlock.text} isDragging /> : null} </DragOverlay>
    </DndContext>
  );
};

export default BlockCodingSlide;