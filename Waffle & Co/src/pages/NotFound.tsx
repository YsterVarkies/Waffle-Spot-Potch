import { TLink } from '@/lib/transition';
import { PageHero } from '@/components/PageHero';
import './pages.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <title>Page not found – The Waffle Spot</title>
      <PageHero title="Empty plate" lead="This page has been eaten, or it was never on the menu.">
        <TLink to="/" className="btn">
          Back to the Spot <span className="arrow" aria-hidden="true">→</span>
        </TLink>
      </PageHero>
    </div>
  );
}
