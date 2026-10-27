// Photographs from The Waffle Spot's Google Business listing, optimised into /public/images.
// Many are guest uploads: confirm permission or swap in the restaurant's own shots before launch.

export interface PhotoInfo {
  sizes: [number, number];
  /** pixel size of the larger file */
  width: number;
  height: number;
  alt: string;
  caption: string;
}

export const photos = {
  farmhouse: { sizes: [1200, 2400], width: 2400, height: 1353, alt: 'The thatched farmhouse and lawn at The Waffle Spot on a sunny day', caption: 'The thatched farmhouse on MC Roode Street' },
  'garden-path': { sizes: [900, 1800], width: 1800, height: 1200, alt: 'A brick path through the shaded garden', caption: 'The garden path under the trees' },
  interior: { sizes: [900, 1800], width: 1800, height: 875, alt: 'Inside under the thatch: red chairs, white tables and a wooden balcony', caption: 'Inside, under the thatch' },
  'banana-almond': { sizes: [800, 1600], width: 1600, height: 1200, alt: 'Banana and almond waffle with a scoop of ice cream and toasted almond flakes', caption: 'Banana and Almond Waffle' },
  'dark-chocolate': { sizes: [800, 1600], width: 1600, height: 1200, alt: 'Half waffle with ice cream, dark chocolate shavings and berry sauce', caption: 'Dark chocolate shavings and ice cream' },
  'ice-cream-waffle': { sizes: [800, 1600], width: 1600, height: 1200, alt: 'Half waffle with chocolate pieces and a scoop of vanilla ice cream on a white plate', caption: 'Chocolate and vanilla ice cream' },
  'caramel-crumble': { sizes: [800, 1600], width: 1600, height: 1200, alt: 'Waffle with caramel sauce, cinnamon crumble and ice cream', caption: 'Caramel, crumble and ice cream' },
  marshmallow: { sizes: [700, 1400], width: 1400, height: 1867, alt: 'Waffle with chocolate sauce, marshmallows and a bowl of ice cream', caption: 'Marshmallows and chocolate sauce' },
  oreo: { sizes: [700, 1400], width: 1400, height: 1867, alt: 'Oreo waffle triangles with ice cream and icing sugar on a red plate', caption: 'Oreo Waffle' },
  'candy-floss': { sizes: [700, 1400], width: 1400, height: 1867, alt: 'Candy floss waffle in pink, purple and blue with sprinkles and ice cream', caption: 'Candy Floss Waffle' },
  'berry-waffle': { sizes: [800, 1600], width: 1600, height: 1216, alt: 'Round waffle with berry compote, ice cream and a berry drizzle', caption: 'Blueberry Waffle' },
  'berry-ice-cream': { sizes: [700, 1060], width: 1060, height: 773, alt: 'Waffle with ice cream, berry sauce and chocolate', caption: 'Berry sauce and ice cream' },
  'fried-chicken': { sizes: [700, 1060], width: 1060, height: 1060, alt: 'Fried chicken strips on golden waffles with a pot of buttermilk syrup', caption: 'Fried Chicken Waffle' },
  'table-overhead': { sizes: [700, 1400], width: 1400, height: 1867, alt: 'A table seen from above with waffles, a teapot, milk and cups of tea', caption: 'Waffles and tea for the table' },
  'churro-shake': { sizes: [700, 1400], width: 1400, height: 1867, alt: 'Caramel milkshake topped with whipped cream and a churro', caption: 'Fancy shake with a churro' },
  'berry-shake': { sizes: [700, 1400], width: 1400, height: 1867, alt: 'Berry milkshake with whipped cream, blueberries and a wafer', caption: 'Berry shake' },
  'choc-chip-shake': { sizes: [700, 1060], width: 1060, height: 1060, alt: 'Chocolate chip milkshake with cream and biscuits in a tall glass', caption: 'Chocolate chip shake' },
  'mint-shake': { sizes: [600, 1060], width: 1060, height: 1979, alt: 'Pale green lime milkshake in the garden', caption: 'Lime milkshake' },
  'vanilla-shake': { sizes: [600, 1060], width: 1060, height: 1979, alt: 'Vanilla milkshake in a tall glass on a garden table', caption: 'Vanilla shake' },
  cappuccino: { sizes: [700, 1400], width: 1400, height: 1867, alt: 'Cappuccino in a white cup on a saucer', caption: 'Cappuccino' },
  'menu-covers': { sizes: [700, 1400], width: 1400, height: 1867, alt: 'The printed Waffle Spot menus on a table', caption: 'The printed menu' },
  'chocolate-cream': { sizes: [800, 1600], width: 1600, height: 900, alt: 'Chocolate waffle with cream and ice cream on a silver charger', caption: 'Chocolate and cream' },
} satisfies Record<string, PhotoInfo>;

export type PhotoName = keyof typeof photos;

export const photoSrc = (name: PhotoName, size: 0 | 1 = 1) => `/images/${name}-${photos[name].sizes[size]}.webp`;
