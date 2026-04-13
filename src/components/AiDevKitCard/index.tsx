import React from 'react';
import { motion } from 'framer-motion';

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
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="
                flex flex-col gap-3 p-5
                bg-white border border-slate-200
                rounded-xl shadow-sm
                hover:shadow-md
                transition-shadow duration-200
                cursor-default
            "
        >
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    {icon}
                </div>
                <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{title}</h4>
                    {count !== undefined && countLabel && (
                        <span className="text-xs text-slate-400">{count} {countLabel}</span>
                    )}
                </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{description}</p>
        </motion.div>
    );
};

export default AiDevKitCard;
