import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(options?: {
  threshold?: number;
  rootMargin?: string;
}) {
  const { threshold = 0.2, rootMargin = "0px" } = options ?? {};
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(raf);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, threshold, rootMargin]);

  return { ref, inView };
}
