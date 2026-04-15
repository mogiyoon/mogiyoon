import React from 'react';
import { CloseIcon } from './icons';
import type { AiDevKitModalData } from './types';

interface ModalHeaderProps {
  item: AiDevKitModalData;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ item, onClose }) => (
  <div className="flex items-start justify-between gap-4 border-b border-line bg-surface p-6">
    <div className="flex min-w-0 items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
        {item.icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-700">
          {item.eyebrow}
        </p>
        <h3 className="mt-2 text-2xl font-bold text-content sm:text-3xl">
          {item.title}
        </h3>
      </div>
    </div>

    <button
      type="button"
      onClick={onClose}
      className="rounded-full border border-line bg-surface p-2 text-content-muted transition-colors duration-200 hover:text-content"
      aria-label={item.closeLabel}
    >
      <CloseIcon />
    </button>
  </div>
);

export default ModalHeader;
