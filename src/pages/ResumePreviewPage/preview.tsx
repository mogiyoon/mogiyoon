import React from 'react';
import type { ResumeBlockDetailItem } from '../../utils/resumePreview';

/**
 * 이력서 미리보기 (오른쪽 패널) 에서만 쓰이는 인라인 헬퍼.
 * D-011 (resume-preview card primitives) 가 글로벌 추출 대상이므로
 * 페이지 로컬에 보관한다.
 */

export const DetailPreviewItem: React.FC<{ item: ResumeBlockDetailItem }> = ({ item }) => (
  <div className="resume-preview-detail grid grid-cols-[3.7rem_minmax(0,1fr)] gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">{item.label}</p>
    <p className="text-[12.5px] leading-[1.42] text-slate-700 whitespace-pre-wrap">{item.value}</p>
  </div>
);
