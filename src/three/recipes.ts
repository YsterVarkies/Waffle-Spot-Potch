import { menu, type MenuItem } from '@/data/menu';

export type ToppingType =
  | 'banana'
  | 'almond'
  | 'oreo'
  | 'sprinkle'
  | 'floss'
  | 'marshmallow'
  | 'shaving'
  | 'strawberry'
  | 'blueberry'
  | 'chunk'
  | 'chicken'
  | 'bacon'
  | 'chip'
  | 'nut';

export interface Recipe {
  id: string;
  /** exact name on the printed menu, used to look up its prices and description */
  menuName: string;
  short: string;
  kind: 'sweet' | 'savoury';
  scoop: boolean;
  drizzle: string[];
  pool?: { color: string; share: number };
  toppings: { type: ToppingType; count: number; colors?: string[] }[];
  dust?: boolean;
}

const SAUCE = {
  chocolate: '#3a1a0b',
  caramel: '#b8661c',
  maple: '#7a360b',
  berry: '#6d1530',
  white: '#f3e6d0',
  peanut: '#c58a4a',
  barOne: '#5a2a10',
  buttermilk: '#d99a3e',
};

export const recipes: Recipe[] = [
  {
    id: 'banana-almond',
    menuName: 'Banana and Almond Waffle',
    short: 'Banana and almond',
    kind: 'sweet',
    scoop: true,
    drizzle: [SAUCE.caramel],
    toppings: [
      { type: 'banana', count: 9 },
      { type: 'almond', count: 46 },
    ],
    dust: true,
  },
  {
    id: 'oreo',
    menuName: 'Oreo Waffle',
    short: 'Oreo',
    kind: 'sweet',
    scoop: true,
    drizzle: [SAUCE.peanut, SAUCE.white],
    toppings: [{ type: 'oreo', count: 70 }],
    dust: true,
  },
  {
    id: 'candy-floss',
    menuName: 'Candy Floss Waffle',
    short: 'Candy floss',
    kind: 'sweet',
    scoop: true,
    drizzle: [SAUCE.white],
    toppings: [
      { type: 'floss', count: 14, colors: ['#f7a8cf', '#b9a3f2', '#9fd6f6'] },
      { type: 'sprinkle', count: 90, colors: ['#ff4d8d', '#ffd23f', '#5ec2f2', '#7bd36b', '#ffffff', '#ff8a3d'] },
    ],
  },
  {
    id: 'smores',
    menuName: 'S’mores Waffle',
    short: 'S’mores',
    kind: 'sweet',
    scoop: false,
    drizzle: [SAUCE.chocolate],
    toppings: [
      { type: 'marshmallow', count: 14 },
      { type: 'shaving', count: 40 },
    ],
  },
  {
    id: 'strawberry-chocolate',
    menuName: 'Strawberry Chocolate Waffle',
    short: 'Strawberry chocolate',
    kind: 'sweet',
    scoop: true,
    drizzle: [SAUCE.chocolate],
    toppings: [{ type: 'strawberry', count: 10 }],
    dust: true,
  },
  {
    id: 'blueberry',
    menuName: 'Blueberry Waffle',
    short: 'Blueberry',
    kind: 'sweet',
    scoop: true,
    drizzle: [SAUCE.berry],
    pool: { color: SAUCE.berry, share: 0.5 },
    toppings: [{ type: 'blueberry', count: 46 }],
  },
  {
    id: 'bar-one',
    menuName: 'Bar-One Waffle',
    short: 'Bar-One',
    kind: 'sweet',
    scoop: true,
    drizzle: [SAUCE.barOne, SAUCE.caramel],
    toppings: [{ type: 'chunk', count: 26, colors: ['#4a220c', '#6b3412', '#c58a4a'] }],
  },
  {
    id: 'syrup',
    menuName: 'Syrup Waffle',
    short: 'Syrup',
    kind: 'sweet',
    scoop: true,
    drizzle: [SAUCE.maple],
    pool: { color: SAUCE.maple, share: 1 },
    toppings: [],
  },
  {
    id: 'peppermint',
    menuName: 'Peppermint Crisp Waffle',
    short: 'Peppermint Crisp',
    kind: 'sweet',
    scoop: true,
    drizzle: [SAUCE.caramel, SAUCE.chocolate],
    toppings: [{ type: 'chunk', count: 30, colors: ['#7cc79b', '#3b1c0c', '#a8dcb9'] }],
  },
  {
    id: 'fried-chicken',
    menuName: 'Fried Chicken',
    short: 'Fried chicken',
    kind: 'savoury',
    scoop: false,
    drizzle: [SAUCE.buttermilk],
    toppings: [{ type: 'chicken', count: 3 }],
  },
  {
    id: 'bacon-banana',
    menuName: 'Bacon and Banana Waffle',
    short: 'Bacon and banana',
    kind: 'savoury',
    scoop: false,
    drizzle: [SAUCE.maple],
    toppings: [
      { type: 'bacon', count: 3 },
      { type: 'banana', count: 7 },
    ],
  },
];

const allItems = menu.flatMap(s => s.groups.flatMap(g => g.items));

export function menuItemFor(r: Recipe): MenuItem {
  const item = allItems.find(i => i.name === r.menuName);
  if (!item) throw new Error(`Menu item not found: ${r.menuName}`);
  return item;
}
