import { useRef } from 'react';
import { TLink } from '@/lib/transition';
import { site } from '@/data/site';
import { menu, countItems, fromPrice, shakeNames } from '@/data/menu';
import { Photo } from '@/components/Photo';
import { FitText } from '@/components/FitText';
import ScrollVelocity from '@/components/reactbits/ScrollVelocity';
import Stack from '@/components/reactbits/Stack';
import CountUp from '@/components/reactbits/CountUp';
import type { PhotoName } from '@/data/photos';

/* Showcase: a band of unequal panels */
const panels: { name: PhotoName; grow: number; label?: string }[] = [
  { name: 'banana-almond', grow: 5, label: 'Banana and Almond' },
  { name: 'oreo', grow: 2 },
  { name: 'fried-chicken', grow: 3 },
  { name: 'candy-floss', grow: 2 },
];

export function ShowcaseBand() {
  return (
    <section className="band ground-light" aria-labelledby="band-title" data-reveal-group>
      <div className="grid">
        <h2 id="band-title" className="head band-title" data-reveal>
          Sweet and savoury
        </h2>
      </div>
      <div className="band-strip" data-reveal>
        {panels.map((p, i) => (
          <figure key={p.name} className="band-panel" style={{ ['--grow' as string]: p.grow }}>
            <Photo name={p.name} sizes="(max-width: 760px) 60vw, 45vw" />
            {i === 0 ? (
              <figcaption className="band-card">
                <span>{p.label}</span>
                <span className="num">Half R63, full R105</span>
              </figcaption>
            ) : (
              <figcaption className="sr-only">{p.name.replace('-', ' ')}</figcaption>
            )}
          </figure>
        ))}
      </div>
      <p className="band-caption wrap" data-reveal>
        Forty-odd waffles, from a R40 syrup half to a R138 Prego steak. Every sweet one comes with cream or ice cream.{' '}
        <TLink to="/menu" className="text-link">
          Read the whole menu
        </TLink>
      </p>
    </section>
  );
}

/* Gallery as prints dropped on the headline: fancy shakes */
const prints: PhotoName[] = ['churro-shake', 'berry-shake', 'choc-chip-shake', 'vanilla-shake'];

export function ShakePrints() {
  return (
    <section className="prints ground-blush" aria-labelledby="prints-title">
      <div className="prints-marquee" aria-hidden="true">
        <ScrollVelocity
          texts={[shakeNames.slice(0, 7), shakeNames.slice(7)].map((row, r) => (
            <span key={r} className="mq-row">
              {row.map(name => (
                <span key={name} className="mq-item">
                  {name}
                </span>
              ))}
            </span>
          ))}
          velocity={38}
          numCopies={3}
          outlineAlternate
          className="prints-marquee-text"
          parallaxClassName="prints-parallax"
          scrollerClassName="prints-scroller"
        />
      </div>
      <div className="prints-field">
        <h2 id="prints-title" className="prints-headline">
          <span>Fancy</span>
          <span>shakes</span>
        </h2>
        <div className="prints-stack">
          <Stack
            cards={prints.map(p => (
              <Photo key={p} name={p} sizes="(max-width: 760px) 52vw, 26vw" draggable={false} />
            ))}
            layout="fan"
            visible={4}
            spread={0.7}
            radius={0}
            frame={8}
            frameColor="#ffffff"
            shadow={false}
            tilt={0}
            sendToBackOnClick
          />
        </div>
        <figure className="prints-small">
          <Photo name="mint-shake" sizes="16vw" />
          <figcaption className="sr-only">Lime milkshake in the garden</figcaption>
        </figure>
        <p className="prints-note">
          Fourteen flavours, all R59: tiramisu, Turkish delight, toasted marshmallow and eleven more. Drag the top print to
          shuffle.{' '}
          <TLink to="/menu#shakes" className="text-link">
            See every shake
          </TLink>
        </p>
      </div>
    </section>
  );
}

/* About: the place's name as the opening words, a square picture as the drop cap */
export function AboutStatement() {
  return (
    <section className="about ground-light" aria-labelledby="about-title" data-reveal-group>
      <h2 id="about-title" className="sr-only">
        About The Waffle Spot
      </h2>
      <div className="grid about-grid">
        <ul className="about-facts small" data-reveal>
          <li>
            {site.street}, {site.town}
          </li>
          <li>Every day, {site.hoursLabel}</li>
          <li>
            <a className="text-link" href={site.phoneHref}>
              {site.phoneDisplay}
            </a>
          </li>
        </ul>
        <div className="about-text">
          <p className="about-p" data-reveal>
            <span className="about-cap">
              <Photo name="interior" sizes="120px" alt="Inside The Waffle Spot, under the thatch" />
            </span>
            <strong>The Waffle Spot</strong> is the much-loved Waffle &amp; Co on MC Roode Street. Its new owners, Erald and his
            team, kept the menu and changed the name.
          </p>
          <p className="about-p soft" data-reveal>
            That menu runs from biltong and lamb sosatie waffles to Bar-One and Amarula, while the kids ride the bike track
            outside.{' '}
            <TLink to="/story" className="text-link about-link">
              Read our story
            </TLink>
          </p>
        </div>
      </div>
    </section>
  );
}

/* List: statement heading, the menu's pages pushed right */
export function MenuIndex() {
  return (
    <section className="mindex ground-light" aria-labelledby="mindex-title" data-reveal-group>
      <h2 id="mindex-title" className="head mindex-title wrap" data-reveal>
        <span>The menu,</span> <span>page by page</span>
      </h2>
      <div className="grid mindex-grid">
        <figure className="mindex-photo" data-reveal>
          <Photo name="menu-covers" sizes="(max-width: 760px) 60vw, 22vw" />
        </figure>
        <table className="mindex-table" data-reveal>
          <caption className="sr-only">Sections of the menu, with how many items and the lowest price</caption>
          <tbody>
            {menu.map(s => (
              <tr key={s.id}>
                <th scope="row">
                  <TLink to={`/menu#${s.id}`}>
                    {s.title}
                    <span className="mindex-arrow" aria-hidden="true">
                      →
                    </span>
                  </TLink>
                </th>
                <td className="soft">{countItems(s)} items</td>
                <td className="num">
                  {s.id === 'shakes' ? '' : 'from '}R{fromPrice(s)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* Proof, as a table: only what the public listings say */
export function Proof() {
  const rows = [
    { where: 'Google', name: 'Waffle Spot Potchefstroom', says: `${site.rating} stars, ${site.reviewCount} reviews`, href: site.links.googleReviews, cta: 'Read the reviews' },
    { where: 'Facebook', name: 'The Waffle Spot Potchefstroom', says: '8,900+ followers', href: site.links.facebook, cta: 'Follow' },
    { where: 'Instagram', name: site.links.instagramHandle, says: '3,400+ followers', href: site.links.instagram, cta: 'Follow' },
    { where: 'TripAdvisor', name: 'Listed under the old name, Waffle & Co', says: 'Reviews from the Waffle & Co years', href: site.links.tripadvisor, cta: 'Look it up' },
  ];
  return (
    <section className="proof ground-light" aria-labelledby="proof-title" data-reveal-group>
      <h2 id="proof-title" className="head proof-title wrap" data-reveal>
        <span>
          <CountUp to={site.rating} decimals={1} duration={1.4} className="num" /> stars,
        </span>{' '}
        <span className="proof-step">
          <CountUp to={site.reviewCount} duration={1.8} className="num" /> reviews
        </span>
      </h2>
      <div className="wrap">
        <table className="proof-table" data-reveal>
          <caption className="sr-only">Where people talk about The Waffle Spot</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Where</th>
              <th scope="col">Listing</th>
              <th scope="col">What it shows</th>
              <th scope="col">Link</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.where}>
                <th scope="row">{r.where}</th>
                <td className="soft">{r.name}</td>
                <td>{r.says}</td>
                <td className="proof-link">
                  <a className="text-link" href={r.href} target="_blank" rel="noreferrer">
                    {r.cta}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* Contact: the phone number as display type */
export function CallSection() {
  const line = useRef<HTMLAnchorElement>(null);
  return (
    <section className="call ground-gold" aria-labelledby="call-title" data-reveal-group>
      <div className="call-top grid">
        <div className="call-intro" data-reveal>
          <h2 id="call-title" className="head">
            Call the Spot
          </h2>
          <p className="lead">Platters for a crowd, a gluten-free waffle, or just checking we’re open.</p>
        </div>
      </div>
      <div className="call-number-wrap wrap" data-reveal>
        <a ref={line} className="call-number" href={site.phoneHref} aria-label={`Call ${site.phoneDisplay}`}>
          <FitText aria-hidden>{site.phoneDisplay}</FitText>
        </a>
      </div>
      <div className="call-corners wrap small">
        <p>
          {site.street}, {site.town}
          <br />
          Every day, {site.hoursLabel}
        </p>
        <p className="call-social">
          <a className="text-link" href={site.links.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a className="text-link" href={site.links.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a className="text-link" href={site.links.directions} target="_blank" rel="noreferrer">
            Directions
          </a>
        </p>
      </div>
    </section>
  );
}
