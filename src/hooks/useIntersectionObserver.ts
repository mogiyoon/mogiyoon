import { useState, useEffect, RefObject } from 'react';

interface ObserverOptions {
    threshold?: number;
    root?: Element | null;
    rootMargin?: string;
}

/**
 * Intersection Observer를 사용하기 위한 커스텀 훅
 * @param elementRef - 관찰할 요소의 ref 객체
 * @param options - Intersection Observer 옵션
 * @returns 요소의 가시성 여부 (boolean)
 */
export const useIntersectionObserver = (
    elementRef: RefObject<Element | null>,
    options: ObserverOptions
): boolean => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // isVisible 상태가 false일 때만 true로 변경하여
                // 애니메이션이 한 번만 실행되도록 합니다.
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            options
        );

        observer.observe(element);

        // 컴포넌트가 언마운트될 때 observer의 관찰을 중단합니다.
        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
        // isVisible을 의존성 배열에 포함하여, isVisible 상태가 변경될 때마다 effect가 재실행되도록 합니다.
        // 이는 현재 로직상 한번 true가 되면 다시 실행되지 않지만, 명시적으로 의존성을 관리하는 좋은 습관입니다.
    }, [elementRef, options, isVisible]);

    return isVisible;
};
