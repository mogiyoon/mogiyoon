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
                flex w-full flex-col gap-3 p-5 text-left
                bg-surface border border-line
                rounded-card shadow-sm
                hover:shadow-md
                transition-shadow duration-200
                cursor-pointer
            "
        >
            <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent-50 flex items-center justify-center text-accent-600 shrink-0">
                    {icon}
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-content truncate">{title}</h4>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-content-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
            <p className="text-xs text-content-tertiary leading-relaxed line-clamp-2">{description}</p>
        </motion.button>
    );
};

export default AiDevKitCard;
