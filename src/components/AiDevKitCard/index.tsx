import React from 'react';
import { motion } from 'framer-motion';
import { animation } from '../../design-tokens';

interface AiDevKitCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    count?: number;
    countLabel?: string;
}

const AiDevKitCard: React.FC<AiDevKitCardProps> = ({ icon, title, description, count, countLabel }) => {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            transition={animation.chipHover.transition}
            className="
                flex flex-col gap-3 p-5
                bg-surface border border-line
                rounded-card shadow-sm
                hover:shadow-md
                transition-shadow duration-200
                cursor-default
            "
        >
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent-50 flex items-center justify-center text-accent-600 shrink-0">
                    {icon}
                </div>
                <div className="min-w-0">
                    <h4 className="text-sm font-bold text-content truncate">{title}</h4>
                    {count !== undefined && countLabel && (
                        <span className="text-xs text-content-muted">{count} {countLabel}</span>
                    )}
                </div>
            </div>
            <p className="text-xs text-content-tertiary leading-relaxed line-clamp-2">{description}</p>
        </motion.div>
    );
};

export default AiDevKitCard;
