window.CL_DATA = {
  week: 'Week of August 24',
  people: { lauren: { name: 'Lauren', color: 'sage' }, joe: { name: 'Joe', color: 'slate' }, leidy: { name: 'Leidy', color: 'terra' } },
  dealsLine: 'Built around Cermak deals (Aug 13–26): al pastor pork $3.49/lb, pork chops $2.29/lb, XL shrimp $9.99/lb, lemons and limes, Yukon golds 99¢, corn 3/$1.',
  schedule: [
    { day: 'mon', title: 'Taco Tuesday (al pastor pork)', kind: 'cook', method: 'Skillet' },
    { day: 'tue', title: 'Taco leftovers → taco-salad bowls', kind: 'leftover' },
    { day: 'wed', title: 'Sheet Pan Pork Chops with Roasted Veggies', kind: 'cook', method: 'Sheet pan' },
    { day: 'thu', title: 'Leidy #1', kind: 'leidy' },
    { day: 'fri', title: 'Basil Shrimp with Feta and Orzo', kind: 'cook', method: 'Skillet' },
    { day: 'sat', title: 'Sheet Pan Citrus Chicken Thighs and Roasted Tomatoes', kind: 'cook', method: 'Sheet pan' },
    { day: 'sun', title: 'Leidy #2 or chicken leftovers', kind: 'leftover' },
  ],
  meals: [
    { id: 'tacos', day: 'mon', title: 'Taco Tuesday', description: 'Al pastor pork tacos with queso fresco, lettuce, tomato, salsa — with black beans and sweet corn sides.', method: 'Skillet', time: '30 min', healthy: 7, delicious: 9, cost: '~$22', stars: 5, onSale: true, leftovers: 'Tue: taco-salad bowls over lettuce with beans, corn, crushed tortilla chips', votes: { lauren: 'up', joe: 'up' } },
    { id: 'chops', day: 'wed', title: 'Sheet Pan Pork Chops with Roasted Veggies', description: 'Center-cut pork chops roasted with potatoes, green beans and onion, seasoned with smoked paprika and thyme.', method: 'Sheet pan', time: '40 min', healthy: 8, delicious: 8, cost: '~$18', onSale: true, leftovers: 'Slice chops over a green salad, or chop into fried rice', votes: { joe: 'up' } },
    { id: 'shrimp', day: 'fri', title: 'Basil Shrimp with Feta and Orzo', description: 'Warm orzo tossed with tomatoes, green onion, basil, lemon, feta and sautéed shrimp.', method: 'Skillet', time: '30 min', healthy: 8, delicious: 9, cost: '~$26', stars: 5, onSale: true, leftovers: 'Sat lunch: serve cold as an orzo salad', votes: { lauren: 'up', joe: 'up', leidy: 'up' } },
    { id: 'chicken', day: 'sat', title: 'Sheet Pan Citrus Chicken Thighs and Roasted Tomatoes', description: 'Boneless thighs roasted with orange and lemon, garlic, Roma tomatoes and green beans.', method: 'Sheet pan', time: '45 min', healthy: 8, delicious: 8, cost: '~$20', leftovers: 'Sun: shred into wraps with deli cheese. Mon: over rice with the pan juices', votes: { lauren: 'up', joe: 'down' } },
  ],
  requests: [
    { who: 'joe', type: 'meal', text: 'Can we do the basil shrimp again? The kids actually ate it.', when: 'Mon' },
    { who: 'leidy', type: 'out', text: 'Out of cornstarch and the big yogurt', when: 'Tue' },
    { who: 'lauren', type: 'meal', text: 'Something with salmon — it was on sale last time', when: 'Wed' },
    { who: 'joe', type: 'out', text: 'Soda water', when: 'Thu' },
  ],
  pantry: [
    { src: '../../assets/photos/pantry-1.jpg', label: 'Pantry shelf', meta: 'Mar 1 · 9 items' },
    { src: '../../assets/photos/pantry-2.jpg', label: 'Pantry, lower', meta: 'Mar 1 · 6 items' },
    { src: '../../assets/photos/pantry-3.jpg', label: 'Freezer', meta: 'Mar 1 · 8 items' },
  ],
  onHand: ['Olive oil', 'Salt & pepper', 'Garlic powder', 'Smoked paprika', 'Dried thyme', 'Rice'],
  deals: [
    ['Marinated pork taco meat', '$3.49/lb'], ['Center cut pork chops', '$2.29/lb'], ['XL shrimp 16/20', '$9.99/lb'], ['Sweet corn', '3/$1'], ['Yukon gold potatoes', '$0.99/lb'], ['Queso fresco 10 oz', '$1.99'],
  ],
  sections: [
    { name: 'Produce', icon: 'carrot', items: [
      { qty: '2 lbs', name: 'green beans', note: 'Pork chops + citrus chicken' },
      { qty: '1.5 lbs', name: 'Yukon gold potatoes', note: 'Pork chops', sale: '$0.99/lb' },
      { qty: '1', name: 'large white onion', note: 'Pork chops' },
      { qty: '2 bunches', name: 'green onions', note: 'Basil shrimp' },
      { qty: '1.5 lbs', name: 'ripe tomatoes', note: 'Basil shrimp' },
      { qty: '1 bunch', name: 'fresh basil', note: 'Basil shrimp' },
      { qty: '10', name: 'limes', note: 'Tacos', sale: '10/$1' },
      { qty: '6 ears', name: 'sweet corn', note: 'Taco night side', sale: '3/$1' },
      { name: 'Bananas', staple: true },
    ] },
    { name: 'Frozen', icon: 'snowflake', items: [{ name: 'Frozen fruit', staple: true }, { name: 'Frozen spinach', staple: true }] },
    { name: 'Meat / Deli / Bakery', icon: 'beef', items: [
      { qty: '2 lbs', name: 'marinated pork taco meat (al pastor)', note: 'Tacos', sale: '$3.49/lb' },
      { qty: '5', name: 'center-cut pork chops (~2.5 lbs)', note: 'Pork chops', sale: '$2.29/lb' },
      { qty: '1.5 lbs', name: 'XL shrimp 16/20', note: 'Basil shrimp', sale: '$9.99/lb' },
      { qty: '2 lbs', name: 'boneless chicken thighs', note: 'Citrus chicken' },
      { name: 'Bread', staple: true },
    ] },
    { name: 'Dry Goods / Canned / Condiments', icon: 'wheat', items: [
      { qty: '1 lb', name: 'orzo', note: 'Basil shrimp' },
      { qty: '1 jar', name: 'salsa', note: 'Tacos', sale: '$2.99' },
      { qty: '1 can', name: 'Goya black beans 29 oz', note: 'Taco side', sale: '2/$5' },
      { name: 'Cornstarch', from: 'Leidy' },
    ] },
    { name: 'Dairy / Eggs', icon: 'milk', items: [
      { qty: '1', name: 'queso fresco 10 oz', note: 'Tacos', sale: '$1.99' },
      { qty: '6 oz', name: 'feta, crumbled', note: 'Basil shrimp' },
      { name: 'Yogurt', staple: true, from: 'Leidy' }, { name: 'Eggs', staple: true }, { name: 'Milk', staple: true },
    ] },
    { name: 'Beverages', icon: 'cup-soda', items: [{ name: 'Soda water', staple: true, from: 'Joe' }] },
  ],
  recipe: {
    title: 'Sheet Pan Pork Chops with Roasted Veggies',
    description: 'Center-cut pork chops roasted with potatoes, green beans and onion, seasoned with smoked paprika and thyme.',
    meta: [['Prep', '10 min'], ['Cook', '30 min'], ['Serves', '5 + leftovers']],
    ingredients: ['5 center-cut pork chops (~2.5 lbs)', '1.5 lbs Yukon gold potatoes, quartered', '1 lb green beans, trimmed', '1 large white onion, cut in wedges', '3 tbsp olive oil', '2 tsp smoked paprika', '1 tsp dried thyme', '1 tsp garlic powder', 'Salt and pepper'],
    groups: [
      { name: 'Start the Potatoes', steps: [
        ['Heat the oven to 425°F. Toss <b>1.5 lbs quartered potatoes</b> and <b>1 onion, in wedges</b> with <b>2 tbsp olive oil</b>, <b>salt and pepper</b>.', null],
        ['Spread on a large sheet pan and roast until the edges start to brown.', '15 min'],
      ] },
      { name: 'Season the Chops', steps: [
        ['Mix <b>2 tsp smoked paprika</b>, <b>1 tsp dried thyme</b>, <b>1 tsp garlic powder</b> and a big pinch of salt.', null],
        ['Pat <b>5 pork chops</b> dry, rub with <b>1 tbsp olive oil</b>, then the spice mix on both sides.', null],
      ] },
      { name: 'Roast Together', steps: [
        ['Push the potatoes aside. Add the chops and <b>1 lb green beans</b> to the pan.', null],
        ['Roast until the chops reach 145°F inside.', '15 min'],
        ['Rest the chops 5 minutes before slicing. Save 2 chops for tomorrow.', '5 min'],
      ] },
    ],
  },
};
