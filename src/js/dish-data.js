import { restaurantData } from './restaurant-data.js';

export const dishData = {
  'masala-dosa': {
    name: 'Masala Dosa',
    description:
      'Dosa is a popular South Indian dish made from fermented rice and lentil batter, known for its crispy texture and delicious taste. It is commonly served with chutney and sambar.',
    image:
      'https://images.unsplash.com/photo-1694849789325-914b71ab4075?q=80&w=1074&auto=format&fit=crop',
    restaurants: [
      restaurantData['mtr'],
      restaurantData['ctr'],
      restaurantData['vidyarthi-bhavan'],
    ],
  },
  'bisi-bele-bath': {
    name: 'Bisi Bele Bath',
    description:
      "A wholesome 'hot lentil rice' dish made with rice, lentils, vegetables, and a complex spice blend featuring tamarind and jaggery. It's a cornerstone of Karnataka's culinary heritage.",
    image:
      'https://media.istockphoto.com/id/1221366840/photo/bisibele-bath-hot-lentil-rice-dish.jpg?s=2048x2048&w=is&k=20&c=FxazAaOB-H_m5TltTM00njyObU99pP0BhrRcNBCIrZw=',
    restaurants: [
      restaurantData['mtr'],
      restaurantData['halli-mane'],
      restaurantData['maiyas'],
    ],
  },
  biryani: {
    name: 'Biryani',
    description:
      'Biryani is a go-to comfort food for non veg lovers, made with fragrant rice, tender meat, and rich spices slow-cooked to perfection. From spicy Hyderabadi styles to Bengaluru’s famous Donne biryani, every plate is packed with deep flavors, hearty portions, and pure comfort.',
    image:
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop',
    restaurants: [
      restaurantData['meghana-foods'],
      restaurantData['nagarjuna'],
      restaurantData['rnr-biryani'],
    ],
  },
  'ragi-mudde': {
    name: 'Ragi Mudde',
    description:
      "Nutritious finger millet balls, a staple of Old Mysore region's agricultural roots. Traditionally served with spicy saaru or bassaru and known for incredible health benefits.",
    image:
      'https://images.unsplash.com/photo-1626132646501-f5188f6c6f0d?auto=format&fit=crop&q=80&w=800',
    restaurants: [
      restaurantData['mudde-madappa'],
      restaurantData['halli-mane'],
      restaurantData['kamat-lokaruchi'],
    ],
  },
  'idli-vada': {
    name: 'Idli Vada',
    description:
      'Idli and Vada are a soulful morning ritual — cloud-soft idlis that melt in your mouth, paired with crisp, golden vadas with a gentle crunch. Served with aromatic sambar and freshly ground chutneys,this comforting duo captures the true essence of South Indian breakfast culture.',
    image:
      'https://media.istockphoto.com/id/2223331687/photo/delicious-south-indian-breakfast-food-idli-and-vada.jpg?s=2048x2048&w=is&k=20&c=yzKvLYrr2AAoMsFJJ24IStRoxvGX6EsPw7D8BOq0Y20=',
    restaurants: [
      restaurantData['brahmins-coffee-bar'],
      restaurantData['veena-stores'],
      restaurantData['taaza-thindi'],
    ],
  },
  'filter-coffee': {
    id: 'filter-coffee',
    name: 'Filter Coffee',
    description: "The aromatic heartbeat of Bengaluru's mornings.",
    image:
      'https://www.saffrontrail.com/wp-content/uploads/2006/08/recipe-to-make-filter-kaapi-how-to.1024x1024.jpg',
    restaurants: ['indian-coffee-house', 'by-2-coffee', 'koshys'],
  },
  'donne-biryani': {
    id: 'donne-biryani',
    name: 'Donne Biryani',
    description:
      'Aromatic, green-masala biryani served in traditional eco-friendly leaf bowls.',
    image:
      'https://b.zmtcdn.com/data/pictures/chains/4/18605554/d015c6f371a5f6e864819d7d3d3d4b4a.jpg',
    restaurants: [
      'shivaji-military-hotel',
      'chikpete-donne-biryani',
      'sgs-gundu-palav',
    ],
  },
  bakery: {
    id: 'bakery',
    name: 'Iconic Bakeries',
    description: 'Centuries-old legacy bakes from plum cakes to spicy puffs.',
    image:
      'https://b.zmtcdn.com/data/pictures/7/51557/465715a3a49704c7d0cc328f4ccf1e92.jpg',
    restaurants: ['thoms-bakery', 'og-variar', 'albert-bakery'],
  },
  'street-food': {
    id: 'street-food',
    name: 'Street Food Streets',
    description:
      "The buzzing 'Thindi Beedis' of the city, serving localized vegetarian delights.",
    image:
      'https://b.zmtcdn.com/data/pictures/6/51496/14f4e7e6c4e1a0d8e8b0b8e9b6a6f6c6.jpg',
    restaurants: [
      'vv-puram-street',
      'vijaynagar-street',
      'madhavan-park-bajji',
    ],
  },
  'masala-puri': {
    id: 'masala-puri',
    name: 'Masala Puri',
    description:
      'The ultimate Bengaluru street snack—spicy green pea gravy over crushed puris.',
    image:
      'https://b.zmtcdn.com/data/pictures/0/51550/1f7e6c4e1a0d8e8b0b8e9b6a6f6c6c6.jpg',
    restaurants: ['karnataka-bhel-house'],
  },
  'ice-cream': {
    id: 'ice-cream',
    name: 'Ice Cream Parlors',
    description: 'From heritage sundaes to artisan gelatos.',
    image:
      'https://b.zmtcdn.com/data/pictures/4/50534/2f7e6c4e1a0d8e8b0b8e9b6a6f6c6c6.jpg',
    restaurants: ['corner-house', 'milano-gelato', 'lake-view-milk-bar'],
  },
  'mutton-biryani': {
    id: 'mutton-biryani',
    name: 'Mutton Biryani',
    description:
      'Bold, rustic, and aromatic mutton biryanis from Hoskote to the city center.',
    image:
      'https://b.zmtcdn.com/data/pictures/1/18565432/6f7e6c4e1a0d8e8b0b8e9b6a6f6c6c6.jpg',
    restaurants: ['mani-dum-biryani', 'mallika-biryani', 'sharif-bhai'],
  },
  'mango-milkshake': {
    id: 'mango-milkshake',
    name: 'Mango Milkshake',
    description:
      'Creamy, thick, and topped with fresh fruit—available all year round.',
    image:
      'https://b.zmtcdn.com/data/pictures/7/51447/9f7e6c4e1a0d8e8b0b8e9b6a6f6c6c6.jpg',
    restaurants: ['hotel-sagar'],
  },
  'thatte-idli': {
    id: 'thatte-idli',
    name: 'Thatte Idli',
    description:
      "Famous 'Plate Idlis'—extra soft, flat, and served with a dollop of butter.",
    image:
      'https://b.zmtcdn.com/data/pictures/9/18965432/1a7e6c4e1a0d8e8b0b8e9b6a6f6c6c6.jpg',
    restaurants: [
      'brahmins-thatte-idli',
      'bidadi-thatte-idli',
      'rameshwaram-cafe',
    ],
  },
  'coastal-food': {
    id: 'coastal-food',
    name: 'Coastal Delights',
    description: 'Fresh seafood traditions from the South West coast of India.',
    image:
      'https://b.zmtcdn.com/data/pictures/7/51527/7a7e6c4e1a0d8e8b0b8e9b6a6f6c6c6.jpg',
    restaurants: ['karavalli', 'fishermans-wharf'],
  },
  gobi: {
    id: 'gobi',
    name: 'Gobi Manchurian',
    description:
      "The city's favorite indo-chinese snack—crispy, tangy, and spicy.",
    image:
      'https://b.zmtcdn.com/data/pictures/1/18365432/9a7e6c4e1a0d8e8b0b8e9b6a6f6c6c6.jpg',
    restaurants: ['raja-gobi'],
  },
  'egg-rice': {
    id: 'egg-rice',
    name: 'Egg Rice',
    description: 'The ultimate late-night street food staple of Bengaluru.',
    image:
      'https://b.zmtcdn.com/data/pictures/3/18465431/0b7e6c4e1a0d8e8b0b8e9b6a6f6c6c6.jpg',
    restaurants: [
      'uncle-egg-rice',
      'snehajeevi-egg-rice',
      'egg-corner-vijayanagar',
    ],
  },
  'special-idli': {
    id: 'special-idli',
    name: 'Traditional Idli Varieties',
    description: 'Unique idlis steamed in jackfruit leaves and coconut shells.',
    image:
      'https://b.zmtcdn.com/data/pictures/9/18865432/3b7e6c4e1a0d8e8b0b8e9b6a6f6c6c6.jpg',
    restaurants: ['jagli-thindi'],
  },
};
