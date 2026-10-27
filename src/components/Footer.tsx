import { useRef } from 'react';
import { TLink } from '@/lib/transition';
import { site } from '@/data/site';
import { useFitText, useOpenStatus } from '@/lib/hooks';
import { gsap, useGSAP, MOTION_OK } from '@/lib/gsap';
import { pages } from './Header';

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const mark = useRef<HTMLParagraphElement>(null);
  const status = useOpenStatus();
  useFitText(mark);

  // Signature move, the closing half: the footer rises slower than the page, so the page seems to
  // lift off it, and the wordmark settles from 0.94 to full size as it arrives.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Finishes as the footer's top reaches 70% of the screen, so its rows are fully visible well before the last pixel.
        const scrollTrigger = { trigger: root.current, start: 'top bottom', end: 'top 70%', scrub: true };
        gsap.fromTo('.footer-inner', { yPercent: -32 }, { yPercent: 0, ease: 'none', scrollTrigger });
        gsap.fromTo(mark.current, { scale: 0.94 }, { scale: 1, ease: 'none', scrollTrigger });
      });
    },
    { scope: root },
  );

  const year = new Date().getFullYear();

  return (
    <footer ref={root} className="site-footer ground-dark" aria-labelledby="footer-title">
      <div className="footer-inner">
        <h2 id="footer-title" className="sr-only">
          The Waffle Spot, contact and opening hours
        </h2>
        <div className="footer-cols grid">
          <div className="footer-col">
            <p className="footer-head">Find us</p>
            <p className="soft">{site.street}</p>
            <p className="soft">
              {site.town}, {site.postcode}
            </p>
            <a className="text-link" href={site.links.directions} target="_blank" rel="noreferrer">
              Get directions
            </a>
          </div>
          <div className="footer-col">
            <p className="footer-head">Pages</p>
            <ul className="footer-list">
              <li>
                <TLink to="/">Home</TLink>
              </li>
              {pages.map(p => (
                <li key={p.to}>
                  <TLink to={p.to}>{p.label}</TLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-head">Follow</p>
            <ul className="footer-list">
              <li>
                <a href={site.links.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href={site.links.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href={site.links.googleReviews} target="_blank" rel="noreferrer">
                  Google reviews
                </a>
              </li>
              <li>
                <a href={site.links.tripadvisor} target="_blank" rel="noreferrer">
                  TripAdvisor
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <p className="footer-head">Hours</p>
            <p className="soft">Every day, {site.hoursLabel}</p>
            <p className="soft">
              <span className={`status-dot${status.open ? ' is-open' : ''}`} aria-hidden="true" />
              {status.label}
            </p>
            <a className="text-link" href={site.phoneHref}>
              {site.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="footer-mark-wrap">
          <p ref={mark} className="monument footer-mark" aria-hidden="true">
            <span>The Waffle</span> <span>Spot</span>
          </p>
        </div>
        <p className="footer-legal">
          © {year} {site.name}, {site.town}. Photographs from our guests and our Google listing.
        </p>
      </div>
    </footer>
  );
}
