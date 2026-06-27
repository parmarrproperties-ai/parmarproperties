import { useEffect, useRef, useState } from "react";

export function useScrollReveal<T extends Element>(options: {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
} = {}) {
    const { threshold = 0.15, rootMargin = "0px 0px -80px 0px", triggerOnce = true } = options;
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const defaultOptions = { threshold, rootMargin };

        const callback: IntersectionObserverCallback = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce && ref.current) {
                        observer.unobserve(ref.current);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            });
        };

        const observer = new IntersectionObserver(callback, defaultOptions);
        const currentRef = ref.current;

        let timeoutId: ReturnType<typeof setTimeout>;
        if (currentRef) {
            // Delay observation slightly to allow window.scrollTo(0,0) on page load to complete
            timeoutId = setTimeout(() => {
                observer.observe(currentRef);
            }, 100);
        }

        return () => {
            clearTimeout(timeoutId);
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold, rootMargin, triggerOnce]);

    return { ref, isVisible };
}
