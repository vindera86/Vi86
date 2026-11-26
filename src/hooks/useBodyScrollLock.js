import { useEffect } from 'react';

/**
 * Locks page scrolling while an overlay (dialog / drawer / full-screen modal) is
 * open, and compensates for the disappearing scrollbar so the layout does not
 * jump. Ref-counted, so stacked overlays do not unlock each other.
 *
 * The viewport scroller is the <html> element, so both html and body are locked
 * (locking only body still let the page scroll in Chrome).
 */
let lockCount = 0;
let saved = null;

export default function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;

    const html = document.documentElement;
    const body = document.body;

    if (lockCount === 0) {
      const scrollbar = window.innerWidth - html.clientWidth;
      saved = {
        htmlOverflow: html.style.overflow,
        bodyOverflow: body.style.overflow,
        htmlPaddingRight: html.style.paddingRight,
      };
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      if (scrollbar > 0) html.style.paddingRight = `${scrollbar}px`;
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0 && saved) {
        html.style.overflow = saved.htmlOverflow;
        body.style.overflow = saved.bodyOverflow;
        html.style.paddingRight = saved.htmlPaddingRight;
        saved = null;
      }
    };
  }, [active]);
}
