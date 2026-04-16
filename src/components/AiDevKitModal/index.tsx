import React, { useEffect } from 'react';
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
  useEffect(() => {
    if (!item) return;

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-4 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl overflow-hidden rounded-modal border border-line bg-surface shadow-2xl animate-fade-in-up"
        onClick={(event) => event.stopPropagation()}
      >
        <ModalHeader item={item} onClose={onClose} />

        <div className="max-h-[75vh] overflow-y-auto bg-surface-subtle/40 p-6">
          <div className="space-y-6">
            {item.sections.map((section) => (
              <DetailSection key={section.title} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiDevKitModal;
