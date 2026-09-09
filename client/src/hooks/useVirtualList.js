import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Virtual scrolling hook for rendering large lists efficiently.
 *
 * @param {object} options
 * @param {number} options.itemCount - Total number of items in the list
 * @param {number} options.itemHeight - Height of each item in pixels
 * @param {number} options.containerHeight - Height of the scrollable container in pixels
 * @param {number} [options.overscan=5] - Number of items to render above/below the visible area
 * @returns {{ visibleItems: Array<{index: number, offset: number}>, containerRef: React.RefObject, totalHeight: number, scrollTop: number }}
 */
export function useVirtualList({ itemCount, itemHeight, containerHeight, overscan = 5 }) {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollTop(el.scrollTop);
          ticking = false;
        });
        ticking = true;
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const totalHeight = itemCount * itemHeight;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2;
  const endIndex = Math.min(itemCount, startIndex + visibleCount);

  const visibleItems = [];
  for (let i = startIndex; i < endIndex; i++) {
    visibleItems.push({ index: i, offset: i * itemHeight });
  }

  const scrollToIndex = useCallback(
    (index) => {
      const el = containerRef.current;
      if (el) {
        el.scrollTo({ top: index * itemHeight, behavior: "smooth" });
      }
    },
    [itemHeight]
  );

  return { visibleItems, containerRef, totalHeight, scrollTop, scrollToIndex };
}
