import React from 'react';

interface StickySectionSidebarProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
}

const StickySectionSidebar: React.FC<StickySectionSidebarProps> = ({
    title,
    subtitle,
    children,
}) => {
    return (
        <div className="lg:sticky lg:top-24">
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold text-content sm:text-4xl lg:text-5xl">
                    {title}
                </h2>
                <div className="mt-3 mx-auto h-1 w-12 rounded-full bg-accent-600 lg:mx-0" />
            </div>

            {subtitle ? (
                <p className="mt-4 text-center text-sm leading-relaxed text-content-muted">
                    {subtitle}
                </p>
            ) : null}

            {children ? <div className="mt-8">{children}</div> : null}
        </div>
    );
};

export default StickySectionSidebar;
