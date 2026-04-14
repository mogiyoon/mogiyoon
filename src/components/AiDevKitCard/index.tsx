import React from 'react';
import { motion } from 'framer-motion';
import { animation } from '../../design-tokens';

interface AiDevKitCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}

const AiDevKitCard: React.FC<AiDevKitCardProps> = ({ icon, title, description, onClick }) => {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ y: -2 }}
            transition={animation.chipHover.transition}
            className="
                flex h-full w-full flex-col overflow-hidden text-left
                bg-surface rounded-card shadow-sm
                hover:shadow-xl transition-shadow duration-300
                cursor-pointer
            "
        >
            <div className="p-4">
                <div className="flex aspect-[4/3] items-center justify-center rounded-[2rem] bg-surface-subtle">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 shadow-sm">
                        {icon}
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col px-5 pb-5">
                <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                        <h4 className="text-base font-bold text-content">{title}</h4>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="mt-1 h-4 w-4 shrink-0 text-content-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-content-secondary line-clamp-3">{description}</p>
            </div>
        </motion.button>
    );
};

export default AiDevKitCard;
