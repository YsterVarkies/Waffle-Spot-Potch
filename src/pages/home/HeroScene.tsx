import { lazy, Suspense, useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '@/lib/gsap';
import { TLink } from '@/lib/transition';
import { useOpenStatus } from '@/lib/hooks';
import { site } from '@/data/site';
import { Photo } from '@/components/Photo';
import Magnet from '@/components/reactbits/Magnet';

// The 3D waffle loads with its own chunk, so the rest of the home page doesn't wait for Three.js.
const OWaffle = lazy(() => import('@/three/OWaffle'));

const PHONE = '(max-width: 760px)';

/**
 * The first screen. The name is the monument; the O of SPOT is a window onto the farmhouse.
 * Scrolling opens that window until the place fills the screen (the stage is sticky and the
 * timeline is scrubbed by native scroll, so nothing captures the wheel).
 */
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
      // Capped by screen height too, so two lines always fit above the bottom of the first screen.
      if (!natural || !available) return;
      const byWidth = (80 * available) / natural;
      // room left under the copy and button for two lines of the name, plus the descender of the p
      // Phones keep the smaller size they already had; the taller size is for desktop only.
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

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = root.current!;
        const q = gsap.utils.selector(el);
        const stage = q('.hero-stage')[0] as HTMLElement;
        const layer = q('.hero-reveal')[0] as HTMLElement;
        const layerImg = q('.hero-reveal-inner')[0] as HTMLElement;
        el.classList.add('is-live');

        const source = () =>
          (window.matchMedia(PHONE).matches ? q('.hero-window-phone')[0] : q('.o-window')[0]) as HTMLElement;
        const startClip = () => {
          const s = stage.getBoundingClientRect();
          const w = source().getBoundingClientRect();
          // the O is round on desktop, so the window starts as that round shape and opens out from it
          const r = window.matchMedia(PHONE).matches ? '0px' : '50%';
          return `inset(${w.top - s.top}px ${s.right - w.right}px ${s.bottom - w.bottom}px ${w.left - s.left}px round ${r})`;
        };
        // The full-screen picture starts shrunk into the window, so the O shows the whole farmhouse,
        // then grows with the clip until it fills the screen.
        const startImg = () => {
          const s = stage.getBoundingClientRect();
          const w = source().getBoundingClientRect();
          return {
            x: w.left + w.width / 2 - (s.left + s.width / 2),
            y: w.top + w.height / 2 - (s.top + s.height / 2),
            scale: Math.max(w.width / s.width, w.height / s.height),
          };
        };

        // Entrance on load: the monument rises into place, then the sentence and the action.
        // The photo layer is only armed once the O has landed, so its window is measured in place.
        const arm = () => {
          el.classList.add('is-armed');
          ScrollTrigger.refresh();
        };
        gsap.from(q('.mono-inner'), {
          yPercent: 38,
          autoAlpha: 0,
          duration: 1.2,
          ease: 'power4.out',
          stagger: 0.09,
          delay: 0.1,
          onComplete: arm,
        });
        gsap.from(q('.hero-copy-inner > *, .hero-aside-inner > *'), { y: 18, autoAlpha: 0, duration: 0.9, stagger: 0.07, delay: 0.4 });

        // The scene, scrubbed by the scroll through the tall section.
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
        });
        // On desktop the photo layer is invisible at the top of the page (the round waffle stands alone in the O)
        // and fades in under the waffle as the scroll starts.
        tl.fromTo(layer, { autoAlpha: () => (window.matchMedia(PHONE).matches ? 1 : 0) }, { autoAlpha: 1, duration: 0.1 }, 0)
          .fromTo(layer, { clipPath: startClip }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 0.62, ease: 'power2.inOut' }, 0)
          .fromTo(
            layerImg,
            { x: () => startImg().x, y: () => startImg().y, scale: () => startImg().scale },
            { x: 0, y: 0, scale: 1, duration: 0.62, ease: 'power2.inOut' },
            0,
          )
          .to(q('.o-window'), { autoAlpha: 0, duration: 0.25 }, 0)
          .to(q('.mono-line--waffle'), { yPercent: -45, scale: 0.94, autoAlpha: 0, duration: 0.42 }, 0)
          .to(q('.mono-sp, .mono-the'), { xPercent: -35, autoAlpha: 0, duration: 0.42 }, 0)
          .to(q('.mono-t'), { xPercent: 90, autoAlpha: 0, duration: 0.42 }, 0)
          .to(q('.hero-copy, .hero-aside, .hero-window-phone-wrap'), { y: -48, autoAlpha: 0, duration: 0.28 }, 0)
          .fromTo(q('.hero-statement'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.16, ease: 'power2.out' }, 0.66)
          .to({}, { duration: 0.18 });

        return () => el.classList.remove('is-live', 'is-armed');
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

        <div className="hero-reveal" aria-hidden="true">
          <div className="hero-reveal-inner">
            <Photo name="farmhouse" alt="" sizes="100vw" priority />
          </div>
        </div>
        <p className="hero-statement">
          A thatched farmhouse, big old trees and a lawn for the kids. Open every day from nine to five.
        </p>
      </div>

      <figure className="hero-rest">
        <Photo name="farmhouse" sizes="100vw" />
        <figcaption>A thatched farmhouse, big old trees and a lawn for the kids. Open every day from nine to five.</figcaption>
      </figure>
    </section>
  );
}
