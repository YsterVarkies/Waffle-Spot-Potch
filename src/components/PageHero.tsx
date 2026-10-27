import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';
import { FitText } from './FitText';
import { Photo } from './Photo';
import type { PhotoName } from '@/data/photos';

interface PageHeroProps {
  title: string;
  lead: ReactNode;
  aside?: ReactNode;
  photo?: PhotoName;
  children?: ReactNode;
}

/** Sub-page opening: one sentence, one picture, and the page's name set as a monument along the bottom. */
export function PageHero({ title, lead, aside, photo, children }: PageHeroProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('.page-hero-title', { yPercent: 34, autoAlpha: 0, duration: 1.2, ease: 'power4.out', delay: 0.05 });
        gsap.from('.page-hero-copy > *, .page-hero-aside > *', { y: 18, autoAlpha: 0, duration: 0.9, stagger: 0.07, delay: 0.3 });
        gsap.from('.page-hero-pic', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'power4.inOut', delay: 0.15 });
        // the monument settles as the opening screen leaves
        gsap.to('.page-hero-title', {
          scale: 0.94,
          yPercent: -6,
          transformOrigin: '0% 100%',
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.fromTo(
          '.page-hero-pic img',
          { yPercent: 0, scale: 1.08 },
          { yPercent: 8, scale: 1.08, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } },
        );
      });
    },
    { scope: root },
  );

  return (
    <header ref={root} className="page-hero ground-dark">
      <div className="page-hero-top grid">
        <div className="page-hero-copy">
          <p className="lead">{lead}</p>
          {children}
        </div>
        {photo ? (
          <figure className="page-hero-pic">
            <Photo name={photo} sizes="(max-width: 760px) 100vw, 34vw" priority />
          </figure>
        ) : null}
        {aside ? <div className="page-hero-aside small">{aside}</div> : null}
      </div>
      <div className="page-hero-title-wrap">
        <FitText as="h1" className="page-hero-title">
          {title}
        </FitText>
      </div>
    </header>
  );
}
