import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { TLink } from '@/lib/transition';
import { site } from '@/data/site';
import { useOpenStatus } from '@/lib/hooks';

export const pages = [
  { to: '/menu', label: 'Menu' },
  { to: '/story', label: 'Story' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/visit', label: 'Visit' },
];

export function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'top' | 'shown' | 'hidden'>('top');
  const status = useOpenStatus();

  // Plain bar: transparent at the top of a page, solid when it comes back on an upward scroll.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 60) setMode('top');
      else if (y > last + 6) setMode('hidden');
      else if (y < last - 6) setMode('shown');
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle('nav-open', open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`site-header is-${open ? 'shown' : mode}${open ? ' is-open' : ''}`}>
      <div className="site-header-bar">
        <TLink to="/" className="wordmark" aria-label="The Waffle Spot, home">
          The Waffle Spot
        </TLink>
        <nav className="site-nav" aria-label="Main">
          <ul>
            <li>
              <TLink to="/" aria-current={pathname === '/' ? 'page' : undefined}>
                Home
              </TLink>
            </li>
            {pages.map(p => (
              <li key={p.to}>
                <TLink to={p.to} aria-current={pathname === p.to ? 'page' : undefined}>
                  {p.label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>
        <a className="site-header-action" href={site.links.directions} target="_blank" rel="noreferrer">
          Directions
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(o => !o)}
        >
          <span className={`hamburger${open ? ' is-open' : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <div id="mobile-nav" className="mobile-nav ground-dark" hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            <li>
              <TLink to="/" aria-current={pathname === '/' ? 'page' : undefined}>
                Home
              </TLink>
            </li>
            {pages.map(p => (
              <li key={p.to}>
                <TLink to={p.to} aria-current={pathname === p.to ? 'page' : undefined}>
                  {p.label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-nav-foot">
          <p>
            <span className={`status-dot${status.open ? ' is-open' : ''}`} aria-hidden="true" />
            {status.label}, {status.detail}
          </p>
          <p>
            {site.street}, {site.town}
          </p>
          <p>
            <a className="text-link" href={site.phoneHref}>
              {site.phoneDisplay}
            </a>
            {'  '}
            <a className="text-link" href={site.links.directions} target="_blank" rel="noreferrer">
              Directions
            </a>
          </p>
        </div>
      </div>
    </header>
  );
}
