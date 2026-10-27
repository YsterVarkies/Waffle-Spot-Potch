# The Waffle Spot – website

Multi-page site for **The Waffle Spot**, 496 MC Roode Street, Potchefstroom (formerly Waffle & Co).

| Route | Page |
| --- | --- |
| `/` | Home: the name as a monument, the farmhouse opening out of the O in "SPOT", the 3D half-or-full waffle, highlights |
| `/menu` | The full menu with half / full prices, from the printed menu (October 2026) |
| `/story` | Waffle & Co to The Waffle Spot, the farmhouse, the garden, the local favourites |
| `/gallery` | Masonry gallery of listing photos with a lightbox |
| `/visit` | Live open/closed status, hours, address, map (loads on click), good-to-know, socials |

## Run it

```bash
npm install
npm run dev
```

On Windows, because the folder name contains `&`, npm scripts can trip over `cmd.exe`. If `npm run dev` fails, run Vite directly:

```bash
node node_modules/vite/bin/vite.js
```

Build for production (outputs `dist/`):

```bash
npm run build
```

or, if the `&` in the path gets in the way, `node node_modules/typescript/bin/tsc -b && node node_modules/vite/bin/vite.js build`.

The site is a single-page app with real URLs (`/menu`, `/visit`…). Hosting needs a fallback to `index.html`: `public/_redirects` covers Netlify and `vercel.json` covers Vercel. On Apache, add a rewrite to `index.html` in `.htaccess`.

## Where to change things

- **Hours, phone, address, social links, rating:** `src/data/site.ts`
- **Menu items and prices:** `src/data/menu.ts` (every page reads from it, including the 3D picker on the home page)
- **Waffles in the 3D picker and their toppings:** `src/three/recipes.ts`
- **Photos:** `public/images/` (WebP, two widths each) and their alt text and captions in `src/data/photos.ts`
- **Colours and type sizes:** the tokens at the top of `src/styles/global.css`

## What it is built with

- **React 19 + Vite + TypeScript**, routing with **React Router**
- **GSAP** (ScrollTrigger, SplitText via React Bits) for the scroll scene, section entrances, the waffle-grid page transition and the scaling wordmarks
- **Lenis** for weighted wheel scrolling (off for reduced motion; touch is never smoothed)
- **Three.js** via **@react-three/fiber** and **drei**: a procedurally modelled Belgian waffle (`src/three/waffleGeometry.ts`) whose toppings are generated per menu item (`src/three/Dressing.tsx`)
- **React Bits** components (installed with the shadcn CLI into `src/components/reactbits/`): SplitText, ScrollVelocity, FlowingMenu, Masonry, CountUp, Magnet, ClickSpark, ScrollReveal, Stack
- Fonts: **Panchang** and **Switzer** from Fontshare (ITF Free Font License), self-hosted in `public/fonts/`

Every animation has a `prefers-reduced-motion` fallback that shows the finished page.

## Before launch

- **Photos.** Every photograph was pulled from the restaurant's Google Business listing. Many are guest uploads, so get the owner's go-ahead, or swap in the restaurant's own shots, before going live. Two (`berry-waffle`, `berry-ice-cream`) are old Waffle & Co promo shots with the watermark cropped off.
- **Menu.** Transcribed from photos of the printed menu taken in October 2026. Ask the owner to check prices and spelling.
- **Hours.** Google lists 09:00–17:00 every day; an older article listed longer weekday hours. Confirm with the owner.
- **TripAdvisor.** The listing still trades as Waffle & Co; the link in `site.ts` is a search link until the exact listing URL is known.
- **Logo.** The wordmark is typeset. If the owner has the waffle-mascot logo as a file, it can go in the header.
- **Follower counts** on the home page (8,900+ Facebook, 3,400+ Instagram) are from October 2026 and will date.
