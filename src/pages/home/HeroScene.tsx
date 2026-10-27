import { lazy, Suspense, useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '@/lib/gsap';
import { TLink } from '@/lib/transition';
import { useOpenStatus } from '@/lib/hooks';
import { site } from '@/data/site';
import { Photo } from '@/components/Photo';
import Magnet from '@/components/reactbits/Magnet';

// The 3D waffle loads with its own chunk, so the rest of the home page doesn't wait for Three.js.
const OWaffle = lazy(() => import('@/three/OWaffle'));

/** The first screen. The name is the monument, and the O of SPOT is a round 3D waffle. */
export function HeroScene() {
  const root = useRef<HTMLElement>(null);
  const mono = useRef<HTMLHeadingElement>(null);
  const waffle = useRef<HTMLSpanElement>(null);
  const status = useOpenStatus();

  // Fit WAFFLE from margin to margin; SPOT shares its size.
  useLayoutEffect(() => {
    const h1 = mono.current;
    const line = waffle.current;
    if (!h1 || !line) return;
    const fit = () => {
      h1.style.setProperty('--mono', '100px');
      const natural = line.scrollWidth;
      const available = h1.clientWidth - parseFloat(getComputedStyle(h1).paddingLeft) * 2;
      // 0.8 leaves the name a little smaller than the full width, so it reads as friendlier, not shouting.
      if (!natural || !available) return;
      const byWidth = (80 * available) / natural;
      // Desktop: capped by the room left under the copy and button, so two lines (and the p's descender) always fit.
      // Phones keep the smaller size they already had.
      const byHeight = window.matchMedia('(min-width: 761px)').matches
        ? (window.innerHeight - 470) / 2
        : window.innerHeight * 0.2;
      h1.style.setProperty('--mono', `${Math.min(byWidth, byHeight).toFixed(2)}px`);
    };
    fit();
    const ro = new ResizeObserver(() => {
      fit();
      ScrollTrigger.refresh();
    });
    ro.observe(h1);
    window.addEventListener('resize', fit);
    document.fonts?.ready.then(() => {
      fit();
      ScrollTrigger.refresh();
    });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, []);

  // Entrance on load: the monument rises into place, then the sentence and the action.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root.current!);
        gsap.from(q('.mono-inner'), {
          yPercent: 38,
          autoAlpha: 0,
          duration: 1.2,
          ease: 'power4.out',
          stagger: 0.09,
          delay: 0.1,
        });
        gsap.from(q('.hero-copy-inner > *, .hero-aside-inner > *'), { y: 18, autoAlpha: 0, duration: 0.9, stagger: 0.07, delay: 0.4 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero ground-dark" aria-labelledby="hero-title">
      <div className="hero-stage">
        <div className="hero-top grid">
          <div className="hero-copy">
            <div className="hero-copy-inner">
              <p className="lead hero-sentence">
                Belgian waffles, sweet and savoury, as a half or a full. Under the trees on MC Roode Street, Potchefstroom.
              </p>
              <Magnet padding={70} magnetStrength={3} wrapperClassName="hero-action">
                <TLink to="/menu" className="btn">
                  See the menu <span className="arrow" aria-hidden="true">→</span>
                </TLink>
              </Magnet>
            </div>
          </div>
          <div className="hero-aside small">
            <div className="hero-aside-inner">
              <p>
                <span className={`status-dot${status.open ? ' is-open' : ''}`} aria-hidden="true" />
                {status.label}, {status.detail}
              </p>
              <p className="soft">Every day, {site.hoursLabel}</p>
              <p className="soft">{site.street}</p>
            </div>
          </div>
        </div>

        <div className="hero-window-phone-wrap wrap" aria-hidden="true">
          <div className="hero-window-phone">
            <Photo name="farmhouse" alt="" sizes="100vw" priority />
          </div>
        </div>

        <h1 ref={mono} id="hero-title" className="hero-mono">
          <span className="mono-the">The</span>
          <span className="mono-line mono-line--waffle">
            <span ref={waffle} className="mono-inner">
              Waffle
            </span>
          </span>
          <span className="mono-line mono-line--spot">
            <span className="mono-inner">
              <span className="mono-sp">Sp</span>
              <span className="o-window">
                <span className="sr-only">o</span>
                <span className="o-canvas">
                  <Suspense fallback={null}>
                    <OWaffle />
                  </Suspense>
                </span>
              </span>
              <span className="mono-t">t</span>
            </span>
          </span>
        </h1>
      </div>
    </section>
  );
}
