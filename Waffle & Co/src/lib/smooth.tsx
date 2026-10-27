import Lenis from 'lenis';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

const LenisContext = createContext<Lenis | null>(null);

/** Weighted wheel scrolling (Lenis) driven by the GSAP ticker so ScrollTrigger stays in sync.
 *  Off for reduced motion; touch scrolling is never smoothed. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (prefersReducedMotion()) return;

    const instance = new Lenis({ lerp: 0.12, smoothWheel: true, anchors: false });
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    if (import.meta.env.DEV) (window as unknown as { lenis?: Lenis }).lenis = instance;

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export const useLenis = () => useContext(LenisContext);

/** Scroll to an element or position, through Lenis when it runs. */
export function scrollToTarget(lenis: Lenis | null, target: string | HTMLElement | number, offset = 0, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate, force: true, duration: immediate ? 0 : 1.2 });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}
