import React from 'react';
import ModalShell from '../primitives/ModalShell';
import DetailSection from './DetailSection';
import ModalHeader from './ModalHeader';
import type { AiDevKitModalData } from './types';

export type {
  AiDevKitCodeSample,
  AiDevKitDetailGroup,
  AiDevKitDetailItem,
  AiDevKitDetailSection,
  AiDevKitFlowLoop,
  AiDevKitGroupedDetailSection,
  AiDevKitModalData,
  AiDevKitSkillItem,
  AiDevKitStepDetail,
} from './types';

interface AiDevKitModalProps {
  item: AiDevKitModalData | null;
  onClose: () => void;
}

const AiDevKitModal: React.FC<AiDevKitModalProps> = ({ item, onClose }) => {
  return (
    <ModalShell
      isOpen={Boolean(item)}
      onClose={onClose}
      className="w-full max-w-5xl overflow-hidden border border-line"
      backdropClassName="flex items-end justify-center bg-black/55 p-4 backdrop-blur-sm sm:items-center sm:p-6"
    >
      {item ? (
        <>
          <ModalHeader item={item} onClose={onClose} />

          <div className="max-h-[75vh] overflow-y-auto bg-surface-subtle/40 p-6">
            <div className="space-y-6">
              {item.sections.map((section) => (
                <DetailSection key={section.title} section={section} />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </ModalShell>
  );
};

export default AiDevKitModal;
