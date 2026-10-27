import { useRef, useState } from 'react';
import { useOpenStatus, useReveal } from '@/lib/hooks';
import { site, weekdays } from '@/data/site';
import { glutenFree } from '@/data/menu';
import { TLink } from '@/lib/transition';
import { PageHero } from '@/components/PageHero';
import { Photo } from '@/components/Photo';
import Magnet from '@/components/reactbits/Magnet';
import './pages.css';

const good = [
  { q: 'Gluten-free?', a: `Yes. ${glutenFree}` },
  { q: 'Bringing kids?', a: 'There is a bike track, a jungle gym and a jumping castle, and a kiddies menu from R35.' },
  { q: 'Coming as a group?', a: 'Waffle platters of five or six half waffles, from R260, are made for sharing.' },
  { q: 'Looking for Waffle & Co?', a: 'You found it. Same place, same menu, new name.' },
];

export default function Visit() {
  const root = useRef<HTMLDivElement>(null);
  const status = useOpenStatus();
  const [map, setMap] = useState(false);
  useReveal(root);

  return (
    <div ref={root} className="visit-page">
      <title>Visit – The Waffle Spot, 496 MC Roode Street, Potchefstroom</title>
      <meta name="description" content="The Waffle Spot is at 496 MC Roode Street, Potchefstroom, open every day from 09:00 to 17:00. Call 076 768 7654." />
      <PageHero
        title="Visit"
        lead={`${site.street}, ${site.town}. Open every day, nine to five.`}
        photo="garden-path"
        aside={
          <>
            <p>
              <span className={`status-dot${status.open ? ' is-open' : ''}`} aria-hidden="true" />
              {status.label}, {status.detail}
            </p>
            <p>
              <a className="text-link" href={site.phoneHref}>
                {site.phoneDisplay}
              </a>
            </p>
          </>
        }
      >
        <Magnet padding={60} magnetStrength={3} maxOffset={14}>
          <a className="btn" href={site.links.directions} target="_blank" rel="noreferrer">
            Get directions <span className="arrow" aria-hidden="true">↗</span>
          </a>
        </Magnet>
      </PageHero>

      <section className="visit-main ground-light" aria-labelledby="hours-title" data-reveal-group>
        <div className="grid visit-grid">
          <div className="visit-hours">
            <h2 id="hours-title" className="head" data-reveal>
              Opening hours
            </h2>
            <p className="visit-now lead" data-reveal aria-live="polite">
              <span className={`status-dot${status.open ? ' is-open' : ''}`} aria-hidden="true" />
              {status.label}, {status.detail}.
            </p>
            <table className="hours-table" data-reveal>
              <caption className="sr-only">Opening hours, every day of the week</caption>
              <tbody>
                {weekdays.map((d, i) => (
                  <tr key={d} className={i === status.dayIndex ? 'is-today' : undefined}>
                    <th scope="row">
                      {d}
                      {i === status.dayIndex ? <span className="today"> today</span> : null}
                    </th>
                    <td className="num">{site.hoursLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="soft" data-reveal>
              Hours as listed on Google. Public holidays can differ, so call ahead if you are driving in.
            </p>
          </div>

          <div className="visit-where">
            <h2 className="head" data-reveal>
              Where we are
            </h2>
            <address className="visit-address lead" data-reveal>
              {site.street}
              <br />
              {site.town}, {site.postcode}
            </address>
            <div className="visit-map" data-reveal>
              {map ? (
                <iframe
                  title="Map showing The Waffle Spot on MC Roode Street, Potchefstroom"
                  src={site.links.mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <button type="button" className="visit-map-load" onClick={() => setMap(true)}>
                  <Photo name="farmhouse" sizes="(max-width: 760px) 100vw, 50vw" alt="" />
                  <span className="btn">Show the map</span>
                </button>
              )}
            </div>
            <p className="visit-links" data-reveal>
              <a className="text-link" href={site.links.directions} target="_blank" rel="noreferrer">
                Directions in Google Maps
              </a>
              <a className="text-link" href={site.phoneHref}>
                Call {site.phoneDisplay}
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="visit-good ground-blush" aria-labelledby="good-title" data-reveal-group>
        <div className="grid visit-split">
          <div className="visit-split-head">
            <h2 id="good-title" className="head" data-reveal>
              Good to know
            </h2>
            <figure className="visit-split-pic" data-reveal>
              <Photo name="candy-floss" sizes="(max-width: 1024px) 100vw, 30vw" />
              <figcaption className="small soft">The Candy Floss Waffle, a kiddies favourite</figcaption>
            </figure>
          </div>
          <dl className="visit-good-list">
            {good.map(g => (
              <div key={g.q} className="visit-good-item" data-reveal>
                <dt>{g.q}</dt>
                <dd>{g.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="visit-follow ground-light" aria-labelledby="follow-title" data-reveal-group>
        <div className="grid visit-split">
          <div className="visit-split-head">
            <h2 id="follow-title" className="head" data-reveal>
              Before you come
            </h2>
            <figure className="visit-split-pic" data-reveal>
              <Photo name="table-overhead" sizes="(max-width: 1024px) 100vw, 30vw" />
              <figcaption className="small soft">Waffles and tea for the table</figcaption>
            </figure>
          </div>
          <ul className="visit-follow-list" data-reveal>
            <li>
              <TLink to="/menu" className="text-link">
                Read the menu
              </TLink>
              <span className="soft">Every waffle, shake and coffee, with prices.</span>
            </li>
            <li>
              <a className="text-link" href={site.links.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
              <span className="soft">{site.links.instagramHandle}</span>
            </li>
            <li>
              <a className="text-link" href={site.links.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
              <span className="soft">Specials and news</span>
            </li>
            <li>
              <a className="text-link" href={site.links.googleReviews} target="_blank" rel="noreferrer">
                Google reviews
              </a>
              <span className="soft">
                {site.rating} stars from {site.reviewCount} reviews
              </span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
