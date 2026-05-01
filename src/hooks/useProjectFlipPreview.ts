import { useEffect, useState } from 'react';

export const useProjectFlipPreview = (projectCount: number, intervalMs = 2000) => {
    const [stepIndex, setStepIndex] = useState(0);

    useEffect(() => {
        setStepIndex(0);
    }, [projectCount]);

    useEffect(() => {
        if (projectCount === 0) return;

        const intervalId = window.setInterval(() => {
            setStepIndex((previous) => {
                const totalSteps = projectCount * 2;
                return (previous + 1) % totalSteps;
            });
        }, intervalMs);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [intervalMs, projectCount]);

    return {
        activeProjectIndex: Math.floor(stepIndex / 2),
        isFlipped: stepIndex % 2 === 1,
    };
};
