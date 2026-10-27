import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { menu, menuExtras, glutenFree, type MenuSection } from '@/data/menu';
import { photoSrc, type PhotoName } from '@/data/photos';
import { useReveal } from '@/lib/hooks';
import { scrollToTarget, useLenis } from '@/lib/smooth';
import { TLink } from '@/lib/transition';
import { PageHero } from '@/components/PageHero';
import { Photo } from '@/components/Photo';
import FlowingMenu from '@/components/reactbits/FlowingMenu';
import './pages.css';

const price = (n?: number) => (n === undefined ? '–' : n);

function MenuSectionView({ s }: { s: MenuSection }) {
  const halfFull = s.priced === 'half-full';
  return (
    <section id={s.id} className="msec" aria-labelledby={`${s.id}-title`} data-reveal-group>
      <div className="msec-head">
        <h2 id={`${s.id}-title`} className="head" data-reveal>
          {s.title}
        </h2>
        <p className="msec-intro" data-reveal>
          {s.intro}
        </p>
        <figure className="msec-pic" data-reveal>
          <Photo name={s.photo as PhotoName} sizes="(max-width: 900px) 100vw, 30vw" />
        </figure>
      </div>
      <div className="msec-body">
        {s.groups.map((g, gi) => {
          const singleGroup = g.items.every(i => i.price !== undefined);
          const cols = halfFull && !singleGroup;
          return (
            <div key={gi} className="mgroup" data-reveal>
              {g.title ? <h3 className="mgroup-title">{g.title}</h3> : null}
              <table className={`mtable${cols ? ' mtable--hf' : ''}`}>
                <caption className="sr-only">
                  {g.title ?? s.title}, prices in rand
                </caption>
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="sr-only">Item</span>
                    </th>
                    {cols ? (
                      <>
                        <th scope="col" className="mt-price">
                          Half
                        </th>
                        <th scope="col" className="mt-price">
                          Full
                        </th>
                      </>
                    ) : (
                      <th scope="col" className="mt-price">
                        <span className="sr-only">Price</span>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {g.items.map(i => (
                    <tr key={i.name}>
                      <th scope="row">
                        <span className="mt-name">
                          {i.name}
                          {i.note ? <span className="mt-note"> {i.note}</span> : null}
                        </span>
                        {i.description ? <span className="mt-desc">{i.description}</span> : null}
                      </th>
                      {cols ? (
                        <>
                          <td className="mt-price num">{price(i.half)}</td>
                          <td className="mt-price num">{price(i.full)}</td>
                        </>
                      ) : (
                        <td className="mt-price num">{i.price ?? i.half}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function MenuPage() {
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [active, setActive] = useState<string>(menu[0].id);
  useReveal(root);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' },
    );
    menu.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const jump = (id: string, e?: MouseEvent<HTMLElement>) => {
    e?.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    scrollToTarget(lenis, el, -70);
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <div ref={root} className="menu-page">
      <title>Menu – The Waffle Spot, Potchefstroom</title>
      <meta
        name="description"
        content="The full Waffle Spot menu with prices: sweet, savoury, boozee and kiddies waffles as a half or a full, waffle platters, fourteen fancy shakes, coffee and cold drinks."
      />
      <PageHero
        title="The menu"
        lead="Every waffle as a half or a full, sweet or savoury, with fourteen fancy shakes and the coffee to go with them."
        photo="menu-covers"
        aside={
          <>
            <p>{glutenFree}</p>
            <p>Prices in rand, from the printed menu.</p>
          </>
        }
      />

      <nav className="menu-flow ground-dark" aria-label="Menu sections">
        <FlowingMenu
          items={menu.map(s => ({ text: s.title, link: `#${s.id}`, image: photoSrc(s.photo as PhotoName, 0), marquee: s.intro }))}
          onItemClick={(_item, index, event) => jump(menu[index].id, event)}
          textColor="#ffffff"
          bgColor="#140a06"
          marqueeBgColor="#ff4d8d"
          marqueeTextColor="#140a06"
          dividers={false}
          imageShape="rounded"
          align="left"
          speed={50}
          ariaLabel="Menu sections"
        />
      </nav>

      <div className="menu-body ground-light">
        <nav className="menu-tabs" aria-label="Jump to a section">
          <ul>
            {menu.map(s => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined} onClick={e => jump(s.id, e)}>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
          <label className="menu-jump">
            <span>Jump to</span>
            <select value={active} onChange={e => jump(e.target.value)}>
              {menu.map(s => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </label>
        </nav>

        {menu.map(s => (
          <MenuSectionView key={s.id} s={s} />
        ))}

        <section className="menu-notes wrap" aria-labelledby="notes-title" data-reveal-group>
          <h2 id="notes-title" className="head" data-reveal>
            Good to know
          </h2>
          <ul className="menu-notes-list" data-reveal>
            <li>{glutenFree}</li>
            <li>Every sweet waffle comes with cream or ice cream.</li>
            <li>{menuExtras}</li>
            <li>Platters exclude the Hamburger and Sosatie waffles.</li>
            <li>Prices are from the printed menu in October 2026 and can change. Ask at the counter for today’s specials.</li>
          </ul>
          <p data-reveal>
            <TLink to="/visit" className="btn">
              Plan your visit <span className="arrow" aria-hidden="true">→</span>
            </TLink>
          </p>
        </section>
      </div>
    </div>
  );
}
