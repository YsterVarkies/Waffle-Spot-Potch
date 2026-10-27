import { useRef } from 'react';
import { useReveal } from '@/lib/hooks';
import { TLink } from '@/lib/transition';
import { site } from '@/data/site';
import { PageHero } from '@/components/PageHero';
import { Photo } from '@/components/Photo';
import ScrollReveal from '@/components/reactbits/ScrollReveal';
import Stack from '@/components/reactbits/Stack';
import type { PhotoName } from '@/data/photos';
import './pages.css';

const album: PhotoName[] = ['berry-waffle', 'marshmallow', 'table-overhead', 'oreo', 'caramel-crumble'];

const favourites = [
  { name: 'Biltong Waffle', what: 'cheese sauce, biltong, creamy mushroom and cheddar' },
  { name: 'Sosatie Waffle', what: 'lamb curry sosaties with chutney on the side' },
  { name: 'Bar-One Waffle', what: 'Bar-One sauce and Bar-One bits' },
  { name: 'Peppermint Crisp Waffle', what: 'caramel, mint crisp shards and chocolate sauce' },
  { name: 'Dom Pedro Waffle', what: 'with Cape Velvet, Amarula or Strawberry Lips' },
  { name: 'Rooibos', what: 'or Five Roses, for R24' },
];

export default function Story() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  return (
    <div ref={root} className="story-page">
      <title>Our story – The Waffle Spot, Potchefstroom</title>
      <meta
        name="description"
        content="The Waffle Spot is the much-loved Waffle & Co on MC Roode Street in Potchefstroom, with new owners, a new name and the same Belgian waffles."
      />
      <PageHero
        title="Our story"
        lead="Potch knew this place as Waffle & Co. New owners, a new name, the same Belgian waffles."
        photo="interior"
      />

      <section className="story-intro ground-light" aria-labelledby="story-intro-title">
        <h2 id="story-intro-title" className="sr-only">
          From Waffle &amp; Co to The Waffle Spot
        </h2>
        <div className="grid">
          <div className="story-intro-text">
            <ScrollReveal tag="p" baseOpacity={0.12} enableBlur blurStrength={4} baseRotation={0} textClassName="story-reveal">
              The waffle house on MC Roode Street changed hands. Erald and his team kept the irons hot, kept the menu everyone
              knew, and changed the sign to The Waffle Spot.
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="story-house ground-dark" aria-labelledby="house-title" data-reveal-group>
        <div className="story-house-pic">
          <Photo name="farmhouse" sizes="100vw" data-drift="" />
        </div>
        <div className="story-house-card">
          <h2 id="house-title" className="head" data-reveal>
            Under the thatch
          </h2>
          <p data-reveal>
            Brick walls, white window frames and a thatched roof, set back from the street behind a lawn. Inside, red chairs and
            long white tables sit under the beams, with a wooden balcony above.
          </p>
        </div>
      </section>

      <section className="story-garden ground-light" aria-labelledby="garden-title" data-reveal-group>
        <div className="grid story-garden-grid">
          <div className="story-garden-text">
            <h2 id="garden-title" className="head" data-reveal>
              Shade and a bike track
            </h2>
            <p data-reveal>
              Most tables are outside, under big green trees and white umbrellas. While the waffles come off the irons, the kids
              have a bike track, a jungle gym and a jumping castle, and you get to finish your coffee.
            </p>
            <p data-reveal>
              <TLink to="/visit" className="text-link">
                Plan a visit
              </TLink>
            </p>
          </div>
          <figure className="story-garden-pic" data-reveal>
            <Photo name="garden-path" sizes="(max-width: 760px) 100vw, 55vw" />
            <figcaption className="small soft">The garden path under the trees</figcaption>
          </figure>
        </div>
      </section>

      <section className="story-menu ground-blush" aria-labelledby="favs-title" data-reveal-group>
        <div className="grid story-menu-grid">
          <div className="story-menu-text">
            <h2 id="favs-title" className="head" data-reveal>
              Same menu, very local
            </h2>
            <p data-reveal>Belgian waffles, with flavours you will only find this side of the equator:</p>
            <ul className="fav-list" data-reveal>
              {favourites.map(f => (
                <li key={f.name}>
                  <strong>{f.name}</strong> <span className="soft">{f.what}</span>
                </li>
              ))}
            </ul>
            <p data-reveal>
              <TLink to="/menu" className="btn">
                See the menu <span className="arrow" aria-hidden="true">→</span>
              </TLink>
            </p>
          </div>
          <div className="story-album" data-reveal>
            <div className="story-album-stack">
              <Stack
                cards={album.map(p => (
                  <Photo key={p} name={p} sizes="(max-width: 760px) 70vw, 30vw" draggable={false} />
                ))}
                layout="pile"
                visible={5}
                radius={0}
                frame={10}
                frameColor="#ffffff"
                shadow={false}
                sendToBackOnClick
              />
            </div>
            <p className="small soft">Drag or tap the top photo to see the next one.</p>
          </div>
        </div>
      </section>

      <section className="story-end ground-dark" aria-labelledby="story-end-title" data-reveal-group>
        <div className="grid">
          <h2 id="story-end-title" className="head story-end-title" data-reveal>
            Come and taste it
          </h2>
          <p className="lead story-end-copy" data-reveal>
            {site.street}, {site.town}. Every day from nine to five.
          </p>
          <div className="story-end-actions" data-reveal>
            <TLink to="/visit" className="btn">
              Plan your visit <span className="arrow" aria-hidden="true">→</span>
            </TLink>
            <a className="text-link" href={site.phoneHref}>
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
