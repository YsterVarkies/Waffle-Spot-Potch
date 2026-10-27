import { Outlet } from 'react-router';
import { SmoothScroll } from '@/lib/smooth';
import { TransitionProvider } from '@/lib/transition';
import ClickSpark from './reactbits/ClickSpark';
import { Header } from './Header';
import { Footer } from './Footer';
import './layout.css';

// Hundreds-and-thousands colours for the click sprinkles.
const SPRINKLES = ['#ff4d8d', '#e9a23b', '#7fc8f8', '#9be37f', '#fff7ef'];

export function RootLayout() {
  return (
    <SmoothScroll>
      <TransitionProvider>
        <ClickSpark sparkColor={SPRINKLES} sparkCount={10} sparkSize={9} sparkRadius={26} shape="line" duration={520} glow={0}>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Header />
          <main id="main" className="page-shell">
            <Outlet />
          </main>
          <Footer />
        </ClickSpark>
      </TransitionProvider>
    </SmoothScroll>
  );
}
