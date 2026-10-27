import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';
import { scrollToTarget, useLenis } from './smooth';

interface TransitionApi {
  go: (to: string) => void;
}

const TransitionContext = createContext<TransitionApi>({ go: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

const CELL = 150;

/** Route changes are covered by a grid of waffle pockets that pop up and drop away. */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const lenis = useLenis();
  const overlay = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const revealNext = useRef(false);
  const [grid, setGrid] = useState({ cols: 10, rows: 6 });

  useEffect(() => {
    const measure = () =>
      setGrid({ cols: Math.ceil(window.innerWidth / CELL), rows: Math.ceil(window.innerHeight / CELL) });
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const cells = () => overlay.current?.querySelectorAll<HTMLElement>('.wt-cell') ?? [];

  const cover = useCallback(
    () =>
      new Promise<void>(resolve => {
        gsap.killTweensOf(cells());
        gsap.set(overlay.current, { visibility: 'visible' });
        gsap.fromTo(
          cells(),
          { scale: 0 },
          {
            scale: 1.08,
            duration: 0.42,
            ease: 'power2.in',
            stagger: { grid: [grid.rows, grid.cols], from: 'center', amount: 0.26 },
            onComplete: resolve,
          },
        );
      }),
    [grid],
  );

  const reveal = useCallback(() => {
    gsap.to(cells(), {
      scale: 0,
      duration: 0.55,
      ease: 'power3.out',
      stagger: { grid: [grid.rows, grid.cols], from: 'center', amount: 0.3 },
      onComplete: () => {
        gsap.set(overlay.current, { visibility: 'hidden' });
        busy.current = false;
      },
    });
  }, [grid]);

  const scrollToHash = useCallback(
    (hash: string, immediate = false) => {
      const el = document.getElementById(decodeURIComponent(hash.replace('#', '')));
      if (el) scrollToTarget(lenis, el, -80, immediate);
    },
    [lenis],
  );

  const go = useCallback(
    async (to: string) => {
      if (busy.current) return;
      const url = new URL(to, window.location.href);
      if (url.pathname === location.pathname) {
        if (url.hash) {
          navigate(to, { replace: true });
          scrollToHash(url.hash);
        } else scrollToTarget(lenis, 0);
        return;
      }
      if (prefersReducedMotion()) {
        navigate(to);
        return;
      }
      busy.current = true;
      await cover();
      lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
      revealNext.current = true;
      navigate(to);
    },
    [cover, lenis, location.pathname, navigate, scrollToHash],
  );

  // After every route change: start at the top (or at the hash), re-measure triggers, uncover.
  useLayoutEffect(() => {
    if (!revealNext.current) {
      lenis?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    }
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (location.hash) setTimeout(() => scrollToHash(location.hash, true), 60);
      if (revealNext.current) {
        revealNext.current = false;
        reveal();
      }
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <TransitionContext.Provider value={{ go }}>
      {children}
      <div
        ref={overlay}
        className="wt"
        aria-hidden="true"
        style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)`, gridTemplateRows: `repeat(${grid.rows}, 1fr)` }}
      >
        {Array.from({ length: grid.cols * grid.rows }, (_, i) => (
          <span key={i} className="wt-cell" />
        ))}
      </div>
    </TransitionContext.Provider>
  );
}

type TLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string; children: ReactNode };

/** Internal link that plays the page transition. Modifier clicks behave like normal links. */
export function TLink({ to, onClick, children, ...rest }: TLinkProps) {
  const { go } = usePageTransition();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(to);
  };
  return (
    <Link to={to} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
