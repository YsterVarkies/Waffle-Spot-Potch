import { useRef } from 'react';
import { useReveal } from '@/lib/hooks';
import { site } from '@/data/site';
import { photos, photoSrc, type PhotoName } from '@/data/photos';
import { PageHero } from '@/components/PageHero';
import { FitText } from '@/components/FitText';
import Masonry from '@/components/reactbits/Masonry';
import './pages.css';

const order: PhotoName[] = [
  'banana-almond',
  'churro-shake',
  'farmhouse',
  'candy-floss',
  'fried-chicken',
  'oreo',
  'berry-waffle',
  'interior',
  'berry-shake',
  'dark-chocolate',
  'table-overhead',
  'cappuccino',
  'caramel-crumble',
  'mint-shake',
  'garden-path',
  'marshmallow',
  'choc-chip-shake',
  'ice-cream-waffle',
  'vanilla-shake',
  'berry-ice-cream',
  'chocolate-cream',
  'menu-covers',
];

export default function Gallery() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  const items = order.map(name => ({
    id: name,
    img: photoSrc(name, 0),
    width: photos[name].width,
    height: photos[name].height,
    title: photos[name].caption,
    alt: photos[name].alt,
  }));

  return (
    <div ref={root} className="gallery-page">
      <title>Gallery – The Waffle Spot, Potchefstroom</title>
      <meta name="description" content="Waffles, fancy shakes, coffee and the garden at The Waffle Spot in Potchefstroom, photographed by our guests." />
      <PageHero
        title="Gallery"
        lead="Waffles, shakes and the garden, mostly photographed by the people eating them."
        photo="candy-floss"
        aside={<p>Tap a photo to see it large.</p>}
      />

      <section className="gallery-grid ground-dark" aria-labelledby="gallery-title">
        <h2 id="gallery-title" className="sr-only">
          Photographs
        </h2>
        <div className="wrap">
          <Masonry
            items={items}
            columns="auto"
            columnWidth={300}
            gap={12}
            radius={0}
            animateFrom="bottom"
            blurToFocus={false}
            hoverEffect="zoom"
            captions="hover"
            lightbox
          />
        </div>
      </section>

      <section className="gallery-tag ground-blush" aria-labelledby="tag-title" data-reveal-group>
        <div className="wrap">
          <h2 id="tag-title" className="head" data-reveal>
            Tag us and you might be next
          </h2>
          <a className="gallery-handle" href={site.links.instagram} target="_blank" rel="noreferrer" data-reveal>
            <FitText aria-hidden>@the_waffle_spot</FitText>
            <span className="sr-only">{site.links.instagramHandle} on Instagram</span>
          </a>
          <p className="gallery-tag-note" data-reveal>
            Post your waffle on Instagram and tag {site.links.instagramHandle}, or share it on our{' '}
            <a className="text-link" href={site.links.facebook} target="_blank" rel="noreferrer">
              Facebook page
            </a>
            . Most of the photos here came from guests who did exactly that, so we get to see what you ordered and you get a
            spot on the wall.
          </p>
        </div>
      </section>
    </div>
  );
}
