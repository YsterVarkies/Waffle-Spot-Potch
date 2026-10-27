import { useEffect, useLayoutEffect, useState, type RefObject } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from './gsap';
import { site, weekdays } from '@/data/site';

/** Staggered entrances: inside `scope`, every [data-reveal-group] reveals its [data-reveal]
 *  children (heading, then text, then picture) once, as the group enters the screen.
 *  Content is visible in the HTML; the script only hides what it is about to animate. */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const groups = gsap.utils.toArray<HTMLElement>('[data-reveal-group]', scope.current);
        groups.forEach(group => {
          const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', group);
          if (!items.length) return;
          gsap.from(items, {
            y: 26,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: { trigger: group, start: 'top 82%', once: true },
          });
        });
        const pics = gsap.utils.toArray<HTMLElement>('[data-drift]', scope.current);
        pics.forEach(pic => {
          gsap.fromTo(
            pic,
            { scale: 1.12, yPercent: -4 },
            {
              scale: 1.02,
              yPercent: 4,
              ease: 'none',
              scrollTrigger: { trigger: pic.parentElement ?? pic, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });
      });
    },
    { scope },
  );
}

/** Size a single line of display type so it runs exactly from margin to margin. */
export function useFitText(ref: RefObject<HTMLElement | null>, deps: unknown[] = [], maxPx = Infinity) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const fit = () => {
      el.style.fontSize = '100px';
      const natural = el.scrollWidth;
      const styles = getComputedStyle(parent);
      const available = parent.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
      if (!natural || !available) return;
      // also capped by screen height, so a big title never runs off the bottom of the first screen
      const size = Math.min(maxPx, (100 * available) / natural, window.innerHeight * 0.2);
      el.style.fontSize = `${size.toFixed(2)}px`;
    };
    fit();
    const ro = new ResizeObserver(() => {
      fit();
      ScrollTrigger.refresh();
    });
    ro.observe(parent);
    document.fonts?.ready.then(() => {
      fit();
      ScrollTrigger.refresh();
    });
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const on = () => setMatches(mql.matches);
    on();
    mql.addEventListener('change', on);
    return () => mql.removeEventListener('change', on);
  }, [query]);
  return matches;
}

interface OpenStatus {
  open: boolean;
  /** e.g. "Open now" / "Closed now" */
  label: string;
  /** e.g. "until 17:00" / "opens 09:00 tomorrow" */
  detail: string;
  /** 0 = Monday … 6 = Sunday, in Potchefstroom */
  dayIndex: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Whether the Spot is open right now, by the clock in Potchefstroom. Re-checks every minute. */
export function useOpenStatus(): OpenStatus {
  const compute = (): OpenStatus => {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: site.timezone,
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date());
    const get = (t: string) => parts.find(p => p.type === t)?.value ?? '';
    const day = get('weekday');
    const minutes = Number(get('hour')) * 60 + Number(get('minute'));
    const dayIndex = Math.max(0, weekdays.indexOf(day as (typeof weekdays)[number]));
    const openAt = site.opens.h * 60 + site.opens.m;
    const closeAt = site.closes.h * 60 + site.closes.m;
    const opensLabel = `${pad(site.opens.h)}:${pad(site.opens.m)}`;
    const closesLabel = `${pad(site.closes.h)}:${pad(site.closes.m)}`;
    if (minutes >= openAt && minutes < closeAt) {
      const left = closeAt - minutes;
      const detail =
        left <= 60 ? `closing at ${closesLabel}, in ${left} min` : `until ${closesLabel} today`;
      return { open: true, label: 'Open now', detail, dayIndex };
    }
    return {
      open: false,
      label: 'Closed now',
      detail: minutes < openAt ? `opens at ${opensLabel} today` : `opens at ${opensLabel} tomorrow`,
      dayIndex,
    };
  };
  const [status, setStatus] = useState<OpenStatus>(compute);
  useEffect(() => {
    const id = window.setInterval(() => setStatus(compute()), 60_000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return status;
}
