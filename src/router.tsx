import { createBrowserRouter } from 'react-router';
import { RootLayout } from './components/RootLayout';
import Home from './pages/Home';

// Home ships with the first load; the other pages load on demand while the page transition covers the screen.
const page = (load: () => Promise<{ default: React.ComponentType }>) => async () => ({ Component: (await load()).default });

export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'menu', lazy: page(() => import('./pages/Menu')) },
        { path: 'story', lazy: page(() => import('./pages/Story')) },
        { path: 'gallery', lazy: page(() => import('./pages/Gallery')) },
        { path: 'visit', lazy: page(() => import('./pages/Visit')) },
        { path: '*', lazy: page(() => import('./pages/NotFound')) },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
