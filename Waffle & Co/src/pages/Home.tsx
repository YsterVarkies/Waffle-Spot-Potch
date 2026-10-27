import { useRef } from 'react';
import { useReveal } from '@/lib/hooks';
import { HeroScene } from './home/HeroScene';
import { HalfOrFull } from './home/HalfOrFull';
import { AboutStatement, CallSection, MenuIndex, Proof, ShakePrints, ShowcaseBand } from './home/Sections';
import './home/home.css';

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  return (
    <div ref={root} className="home">
      <title>The Waffle Spot – Belgian waffles in Potchefstroom</title>
      <meta
        name="description"
        content="Belgian waffles, sweet and savoury, as a half or a full. Fancy shakes, coffee and a garden for the kids at 496 MC Roode Street, Potchefstroom. Open every day, 09:00–17:00."
      />
      <HeroScene />
      <HalfOrFull />
      <ShowcaseBand />
      <ShakePrints />
      <AboutStatement />
      <MenuIndex />
      <Proof />
      <CallSection />
    </div>
  );
}
