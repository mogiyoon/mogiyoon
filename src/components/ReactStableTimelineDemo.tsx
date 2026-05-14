import React from 'react';
import { Timeline, type TimelineItem } from '@mogiyoon/react-stable-timeline';

const ms = (iso: string) => new Date(iso).getTime();

// mogiyoon 포트폴리오 프로젝트들을 실제 기간 그대로 라이브러리에 입력한 라이브 데모.
// GIF 대신 라이브러리 자체를 보여줌으로써 행 안정성·라벨 폭 측정 동작을
// 사용자가 직접 줌·팬으로 확인할 수 있다.
const demoItems: TimelineItem[] = [
    { id: 'teacher-test', label: 'Teacher Test', start: ms('2024-01-01'), end: ms('2024-02-28') },
    { id: 'test-maker', label: 'Test Maker', start: ms('2024-11-01'), end: ms('2025-02-28') },
    { id: 'mrnsg', label: 'mrnsg', start: ms('2025-01-01'), end: ms('2025-01-31') },
    { id: 'recho', label: 'Recho', start: ms('2025-06-01'), end: ms('2025-07-31') },
    { id: 'seoul-meari', label: 'Seoul Meari', start: ms('2025-08-01'), end: ms('2025-09-30') },
    { id: 'boj-snippets', label: 'BOJ Snippets', start: ms('2026-04-01'), end: ms('2026-04-30') },
    { id: 'react-stable-timeline', label: '@mogiyoon/react-stable-timeline', start: ms('2026-05-01'), end: ms('2026-05-31') },
    { id: 'storytect', label: 'Storytect', start: ms('2026-05-01'), end: ms('2026-05-31') },
];

const ReactStableTimelineDemo: React.FC = () => (
    <div className="w-full rounded-modal bg-white shadow-xl border border-line overflow-hidden">
        <Timeline
            items={demoItems}
            accentColor="#6366f1"
            style={{ height: 360 }}
        />
    </div>
);

export default ReactStableTimelineDemo;
