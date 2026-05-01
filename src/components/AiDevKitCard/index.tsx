import React from 'react';
import { motion } from 'framer-motion';
import { animation } from '../../design-tokens';

interface AiDevKitCardProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    onClick: () => void;
}

const AiDevKitCard: React.FC<AiDevKitCardProps> = ({ icon, title, onClick }) => {
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
                cursor-pointer justify-center items-center
            "
        >
            <div className="p-3">
                <div className="flex aspect-[16/10] items-center justify-center rounded-[1.5rem] bg-surface-subtle">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 shadow-sm">
                        {icon}
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col px-4 pb-4">
                <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-tight text-content sm:min-h-[2.75rem] sm:text-[0.95rem]">
                            {title}
                        </h4>
                    </div>
                </div>
            </div>
        </motion.button>
    );
};

export default AiDevKitCard;
