import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { recipes, menuItemFor } from '@/three/recipes';
import type { WaffleSize } from '@/three/WaffleStudio';
import { useMediaQuery } from '@/lib/hooks';
import { Photo } from '@/components/Photo';
import CountUp from '@/components/reactbits/CountUp';
import { glutenFree } from '@/data/menu';

const WaffleStudio = lazy(() => import('@/three/WaffleStudio'));

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

/** The live thing: pick a waffle from the real menu, choose half or full, and watch it get dressed. */
export function HalfOrFull() {
  const section = useRef<HTMLElement>(null);
  const [size, setSize] = useState<WaffleSize>('full');
  const [id, setId] = useState(recipes[0].id);
  const [near, setNear] = useState(false);
  const [webgl] = useState(hasWebGL);
  const isPhone = useMediaQuery('(max-width: 760px)');
  const prevPrice = useRef<number | null>(null);

  const recipe = recipes.find(r => r.id === id)!;
  const item = menuItemFor(recipe);
  const price = (size === 'half' ? item.half : item.full) ?? item.half ?? 0;

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '900px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const from = prevPrice.current ?? price;
  useEffect(() => {
    prevPrice.current = price;
  }, [price]);

  const fallback = <Photo name="banana-almond" sizes="(max-width: 760px) 100vw, 60vw" className="hof-fallback" />;

  return (
    <section ref={section} className="hof ground-dark" aria-labelledby="hof-title">
      <div className="grid hof-grid" data-reveal-group>
        <div className="hof-copy">
          <h2 id="hof-title" className="head" data-reveal>
            Half or full?
          </h2>
          <p className="hof-sub" data-reveal>
            Every waffle on the menu comes in two sizes. Pick one, choose yours and see what lands on the plate. Prices in rand, as on
            the printed menu.
          </p>
        </div>

        <fieldset className="hof-picks" data-reveal>
            <legend className="sr-only">Choose a waffle</legend>
            {recipes.map(r => {
              const it = menuItemFor(r);
              return (
                <label key={r.id} className={`hof-pick${r.id === id ? ' is-on' : ''}`}>
                  <input
                    type="radio"
                    name="waffle"
                    value={r.id}
                    checked={r.id === id}
                    onChange={() => setId(r.id)}
                    className="sr-only"
                  />
                  <span className="hof-pick-name">{r.short}</span>
                  <span className="hof-pick-price num">
                    {it.half}
                    <span className="soft"> / </span>
                    {it.full}
                  </span>
                </label>
              );
            })}
        </fieldset>

        <div className="hof-stage" data-reveal>
          <div className="hof-canvas">
            {webgl && near ? (
              <Suspense fallback={fallback}>
                <WaffleStudio recipe={recipe} size={size} interactive={!isPhone} />
              </Suspense>
            ) : (
              fallback
            )}
            {webgl && !isPhone && <p className="hof-hint small">Drag to turn the plate</p>}
          </div>

          <div className="hof-readout">
            <div className="hof-switch" role="radiogroup" aria-label="Size">
              {(['half', 'full'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={size === s}
                  className={size === s ? 'is-on' : ''}
                  onClick={() => setSize(s)}
                  disabled={s === 'full' && !item.full}
                >
                  {s === 'half' ? 'Half' : 'Full'}
                </button>
              ))}
            </div>
            <p className="hof-price" aria-live="polite">
              <span className="sr-only">
                {size} {item.name}, rand{' '}
              </span>
              <span aria-hidden="true">R</span>
              <CountUp key={`${id}-${size}`} from={from} to={price} duration={0.6} trigger="load" className="num" />
            </p>
            <p className="hof-desc">
              <strong>{item.name}.</strong> {item.description}
              {recipe.kind === 'sweet' ? ' With cream or ice cream.' : ''} <span className="soft">{glutenFree}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
