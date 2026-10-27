// The menu, transcribed from the printed Waffle Spot menu (photographed October 2026).
// Prices in rand. Waffles come as a half or a full; a single `price` means one size.

export interface MenuItem {
  name: string;
  description?: string;
  half?: number;
  full?: number;
  price?: number;
  note?: string;
}

export interface MenuGroup {
  title?: string;
  items: MenuItem[];
}

export interface MenuSection {
  id: string;
  title: string;
  intro: string;
  photo: string;
  priced: 'half-full' | 'single';
  groups: MenuGroup[];
}

export const menu: MenuSection[] = [
  {
    id: 'sweet',
    title: 'Sweet waffles',
    intro: 'Every sweet waffle comes with cream or ice cream.',
    photo: 'banana-almond',
    priced: 'half-full',
    groups: [
      {
        items: [
          { name: 'Fudge Waffle', description: 'Decadent fudge and sweet caramel sauce.', half: 54, full: 94 },
          { name: 'S’mores Waffle', description: 'Toasted marshmallows, chocolate sauce and dark chocolate shavings.', half: 63, full: 109 },
          { name: 'Candy Floss Waffle', description: 'Candy floss, Pop Rocks, crushed Astros and white chocolate sauce.', half: 63, full: 105 },
          { name: 'Banana and Almond Waffle', description: 'Fried banana, caramel sauce and toasted almond flakes.', half: 63, full: 105 },
          { name: 'Turkish Delight Waffle', description: 'Turkish delight and dark chocolate shavings.', half: 52, full: 86 },
          { name: 'Nutella Waffle', description: 'A creamy Nutella blend.', half: 57, full: 103 },
          { name: 'Syrup Waffle', description: 'Maple-flavoured syrup.', half: 40, full: 69 },
          { name: 'Blueberry Waffle', description: 'Blueberries cooked in berry sauce.', half: 57, full: 102 },
          { name: 'Peanut Butter and Banana Waffle', description: 'Peanut butter, fried banana, caramel sauce, Oreo crumbles and sprinkled nuts.', half: 63, full: 105 },
          { name: 'Oreo Waffle', description: 'Oreo cream, peanut butter sauce and Oreo crumble.', half: 50, full: 86 },
          { name: 'Strawberry Chocolate Waffle', description: 'Fresh strawberries and chocolate sauce.', half: 63, full: 105, note: 'Seasonal' },
          { name: 'Mixed Fruit Waffle', description: 'Fresh strawberries, blueberries, banana and caramel sauce.', half: 63, full: 105 },
          { name: 'Biscoff Waffle', description: 'Biscoff sauce and Biscoff cookies.', half: 57, full: 103 },
          { name: 'Bar-One Waffle', description: 'Smothered in Bar-One sauce, sprinkled with Bar-One bits.', half: 57, full: 103 },
          { name: 'All Chocolate Waffle', description: 'Chocolate sauce and chocolate chips.', half: 46, full: 75 },
          { name: 'Apple and Cinnamon Waffle', description: 'Cinnamon-spiced cooked apples and a cinnamon caramel sauce.', half: 50, full: 86 },
        ],
      },
    ],
  },
  {
    id: 'boozee',
    title: 'Boozee waffles',
    intro: 'For grown-ups, with a splash of something.',
    photo: 'caramel-crumble',
    priced: 'half-full',
    groups: [
      {
        items: [
          { name: 'Peach Waffle', description: 'Peaches cooked with brown sugar and whiskey, with cream cheese.', half: 63, full: 103 },
          { name: 'Strawberry Drizzle Waffle', description: 'Strawberry drizzle, white chocolate shavings and whiskey caramel sauce.', half: 63, full: 103 },
          { name: 'Dom Pedro Waffle', description: 'Ice cream and a sauce of your choice: Cape Velvet, Amarula or Strawberry Lips.', half: 63, full: 97 },
        ],
      },
    ],
  },
  {
    id: 'decadent',
    title: 'Decadent',
    intro: 'The richest three on the menu.',
    photo: 'dark-chocolate',
    priced: 'half-full',
    groups: [
      {
        items: [
          { name: 'Black Cherry Waffle', description: 'Cream cheese and dark chocolate blend, black cherries and dark chocolate shavings.', half: 74, full: 115 },
          { name: 'Espresso Waffle', description: 'Vanilla cream cheese, espresso sauce and dark chocolate shavings.', half: 57, full: 102 },
          { name: 'Peppermint Crisp Waffle', description: 'A swirl of creamy caramel, mint crisp shards and chocolate sauce.', half: 57, full: 103 },
        ],
      },
    ],
  },
  {
    id: 'savoury',
    title: 'Savoury waffles',
    intro: 'Golden Belgian waffles with a proper meal on top.',
    photo: 'fried-chicken',
    priced: 'half-full',
    groups: [
      {
        title: 'Hearty waffles',
        items: [
          { name: 'Bacon and Banana Waffle', description: 'Crispy bacon, fresh banana and maple-flavoured syrup.', half: 57, full: 97 },
          { name: 'Three Cheese Waffle', description: 'Creamy cheese sauce, crispy bacon bits, sliced cheese grillers and cheddar.', half: 65, full: 120 },
          { name: 'Biltong Waffle', description: 'Creamy cheese sauce, biltong, creamy mushroom and cheddar, with balsamic glaze.', half: 69, full: 120 },
          { name: 'Prego Steak Waffle', description: 'Thin-sliced peri-garlic steak, caramelised onions and melted mozzarella, finished with peri mayo.', half: 80, full: 138 },
          { name: 'Hamburger Waffle', description: 'Burger-style beef patties with cheddar, creamy cheese sauce and pickled red onion.', half: 80, full: 138 },
          { name: 'Sosatie Waffle', description: 'Tender lamb curry sosaties, with fresh tomato and onion and chutney on the side.', half: 80, full: 138 },
          { name: 'Deboned Pork Ribs', description: 'Tender deboned pork ribs and fried pineapple, with barbecue sauce on the side.', half: 63, full: 109 },
          { name: 'Savoury Waffle', description: 'Savoury mince, cream cheese and guacamole.', half: 69, full: 120 },
          { name: 'Bacon, Avo and Feta Waffle', description: 'Creamy guacamole, salty feta and bacon, finished with balsamic glaze.', half: 58, full: 103 },
        ],
      },
      {
        title: 'Chicken favourites',
        items: [
          { name: 'Chicken Mayo', description: 'Creamy chicken mayonnaise.', half: 57, full: 97 },
          { name: 'Fried Chicken', description: 'Fried chicken strips drizzled with buttermilk syrup.', half: 63, full: 109 },
          { name: 'Mild Butter Chicken Waffle', description: 'Mild butter chicken, tomato and onion salsa, and a side of Greek yoghurt.', half: 69, full: 120 },
          { name: 'Spicy Korean Style', description: 'Sticky Korean-style chicken strips and coleslaw.', half: 74, full: 120 },
        ],
      },
      {
        title: 'Vegetarian',
        items: [
          { name: 'Veggie Waffle', description: 'Creamy mushrooms, guacamole and fried tomato.', half: 74, full: 120 },
          { name: 'Mushroom, Cheese and Onion', description: 'Creamy mushroom, cheddar and caramelised onion.', half: 57, full: 97 },
        ],
      },
    ],
  },
  {
    id: 'kiddies',
    title: 'Kiddies waffles',
    intro: 'Smaller hands, same irons. Kiddies milkshakes too.',
    photo: 'candy-floss',
    priced: 'half-full',
    groups: [
      {
        items: [
          { name: 'Plain Waffle', description: 'Ice cream and maple-flavoured syrup.', half: 35 },
          { name: 'Make Your Own Waffle', description: 'Choc chips, Astros, hundreds and thousands, and chocolate sauce.', half: 52, full: 90 },
          { name: 'Baby S’mores', description: 'Marshmallow and chocolate sauce.', half: 50, full: 80 },
          { name: 'Kiddies Chicken Mayo', description: 'Creamy chicken mayonnaise.', half: 52, full: 86 },
          { name: 'Kiddies Cheese Waffle', description: 'A cheese griller with cheese sauce.', half: 52, full: 85 },
          { name: 'Kiddies Savoury Waffle', description: 'Savoury mince and cheddar.', half: 55, full: 98 },
        ],
      },
      {
        title: 'Kiddies milkshake',
        items: [
          { name: 'Kiddies size', description: 'Chocolate, vanilla, bubblegum, strawberry, lime or banana.', price: 35 },
          { name: 'Large', description: 'The same six flavours.', price: 49 },
        ],
      },
    ],
  },
  {
    id: 'platters',
    title: 'Waffle platters',
    intro: 'Half waffles for the table, chosen by you.',
    photo: 'table-overhead',
    priced: 'single',
    groups: [
      {
        items: [
          { name: 'Sweet Platter', description: 'A selection of five half sweet waffles.', price: 260 },
          { name: 'Savoury Platter', description: 'Five half savoury waffles of your choice. Excludes the Hamburger and Sosatie waffles.', price: 300 },
          { name: 'Mixed Sweet and Savoury Platter', description: 'Three half savoury and three half sweet waffles of your choice. Excludes the Hamburger and Sosatie waffles.', price: 300 },
        ],
      },
    ],
  },
  {
    id: 'shakes',
    title: 'Fancy shakes',
    intro: 'Fourteen of them, all R59.',
    photo: 'churro-shake',
    priced: 'single',
    groups: [
      {
        items: [
          { name: 'Peanut Butter and Oreo', description: 'Creamy peanut butter and crunchy Oreo cookies, swirled into rich vanilla ice cream.', price: 59 },
          { name: 'Toffee Nut Fudge', description: 'A thick shake of toffee, nut and pure fudge.', price: 59 },
          { name: 'Crème Brûlée', description: 'Sweet cream and caramelised sugar in a creamy swirl.', price: 59 },
          { name: 'Turkish Delight', description: 'Fragrant rose, creamy sweetness and a dusting of chocolate.', price: 59 },
          { name: 'Milo', description: 'Rich, malty Milo swirled into an icy shake.', price: 59 },
          { name: 'Popcorn and Caramel', description: 'Sweet caramel meets buttery popcorn.', price: 59 },
          { name: 'Coffee and Cookies', description: 'Cookie crumbles swirled through a vanilla cream blend.', price: 59 },
          { name: 'Nutella Marshmallow', description: 'Creamy hazelnut chocolate swirled with pillowy marshmallow.', price: 59 },
          { name: 'Chocolate Peppermint', description: 'Silky chocolate shake with refreshing peppermint.', price: 59 },
          { name: 'White Chocolate and Hazelnut', description: 'Silky white chocolate and the warmth of hazelnuts.', price: 59 },
          { name: 'Salted Caramel', description: 'Sweet caramel with a cheeky salty twist.', price: 59 },
          { name: 'Butterscotch', description: 'Rich butterscotch with a warm caramel finish.', price: 59 },
          { name: 'Toasted Marshmallow', description: 'Velvety vanilla cream blended with toasted marshmallow.', price: 59 },
          { name: 'Tiramisu', description: 'Coffee-infused, with hints of cocoa and mascarpone-style richness.', price: 59 },
        ],
      },
    ],
  },
  {
    id: 'drinks',
    title: 'Drinks',
    intro: 'Coffee, iced coffee, floats and cold drinks.',
    photo: 'cappuccino',
    priced: 'single',
    groups: [
      {
        title: 'Hot drinks',
        items: [
          { name: 'Americano', price: 26 },
          { name: 'Espresso', price: 26 },
          { name: 'Cappuccino, cup', price: 32 },
          { name: 'Cappuccino, mug', price: 48 },
          { name: 'Caffè Latte', price: 39 },
          { name: 'Red Latte', price: 42 },
          { name: 'Hot Chocolate, cup', price: 32 },
          { name: 'Hot Chocolate, mug', price: 49 },
          { name: 'White Hot Chocolate, cup', price: 32 },
          { name: 'White Hot Chocolate, mug', price: 49 },
          { name: 'Chai Latte, mug', price: 49 },
          { name: 'Dirty Chai', price: 49 },
          { name: 'Mocha, cup', price: 35 },
          { name: 'Mocha, mug', price: 55 },
          { name: 'Mocha, pot', price: 49 },
          { name: 'Blonde Mocha, cup', price: 35 },
          { name: 'Blonde Mocha, mug', price: 55 },
          { name: 'Biscoff Latte', price: 55 },
          { name: 'Tea', description: 'Rooibos or Five Roses.', price: 24 },
        ],
      },
      {
        title: 'Cold drinks',
        items: [
          { name: 'Iced Coffee', description: 'Salted caramel, hazelnut, caramel, white chocolate, vanilla or mocha.', price: 50 },
          { name: 'Lemonade or Sprite', description: 'Kola tonic, passion fruit, lime, blueberry or watermelon.', price: 40 },
          { name: 'Coke or Creme Soda Float', price: 49 },
          { name: 'Coffee Float', price: 59 },
          { name: 'Home-made Iced Tea', price: 36 },
          { name: 'Flavoured Milk', description: 'Strawberry or chocolate.', price: 36 },
          { name: 'Sodas', description: 'Coke, Coke Zero, Sprite, Sprite Zero, Creme Soda, Fanta Orange, Stoney, Twist, Ginger Ale, Sparberry.', price: 26 },
          { name: 'Appletiser or Grapetiser', price: 32 },
          { name: 'Fruit Juice', description: 'Orange, mango-orange, cranberry, breakfast blend, berry blaze or apple.', price: 32 },
          { name: 'Still or Sparkling Water', price: 28 },
        ],
      },
    ],
  },
];

export const menuExtras = 'Extras on hot drinks: decaf R9, milk alternative R15, cream R12.';
export const glutenFree = 'A gluten-free option is available on every waffle.';

export const shakeNames = menu.find(s => s.id === 'shakes')!.groups[0].items.map(i => i.name);

export const countItems = (s: MenuSection) => s.groups.reduce((n, g) => n + g.items.length, 0);

export const fromPrice = (s: MenuSection) =>
  Math.min(...s.groups.flatMap(g => g.items.map(i => i.price ?? i.half ?? i.full ?? Infinity)));
