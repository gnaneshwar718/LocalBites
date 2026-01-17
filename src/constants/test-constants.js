export const MOCK_CULTURE_DATA = {
  restaurants: {
    mtr: {
      id: 'mtr',
      name: 'Mavalli Tiffin Rooms',
      location: 'https://maps.google.com/?q=MTR',
    },
    ctr: {
      id: 'ctr',
      name: 'CTR - Shri Sagar',
      location: 'https://maps.google.com/?q=CTR',
    },
    'vidyarthi-bhavan': {
      id: 'vidyarthi-bhavan',
      name: 'Vidyarthi Bhavan',
      location: 'https://maps.google.com/?q=vidyarthi',
    },
    'halli-mane': {
      id: 'halli-mane',
      name: 'Halli Mane',
      location: 'https://maps.google.com/?q=hallimane',
    },
    maiyas: {
      id: 'maiyas',
      name: 'Maiyas',
      location: 'https://maps.google.com/?q=maiyas',
    },
    'meghana-foods': {
      id: 'meghana-foods',
      name: 'Meghana Foods',
      location: 'https://maps.google.com/?q=meghana',
    },
    nagarjuna: {
      id: 'nagarjuna',
      name: 'Nagarjuna',
      location: 'https://maps.google.com/?q=nagarjuna',
    },
  },
  dishes: {
    d1: {
      id: 'd1',
      name: 'Dish 1',
      description: 'Desc 1',
      restaurants: ['mtr'],
    },
    d2: {
      id: 'd2',
      name: 'Dish 2',
      description: 'Desc 2',
      restaurants: ['ctr'],
    },
    d3: {
      id: 'd3',
      name: 'Dish 3',
      description: 'Desc 3',
      restaurants: ['vidyarthi-bhavan'],
    },
    d4: {
      id: 'd4',
      name: 'Dish 4',
      description: 'Desc 4',
      restaurants: ['halli-mane'],
    },
    d5: {
      id: 'd5',
      name: 'Dish 5',
      description: 'Desc 5',
      restaurants: ['maiyas'],
    },
    d6: {
      id: 'd6',
      name: 'Dish 6',
      description: 'Desc 6',
      restaurants: ['meghana-foods'],
    },
    d7: {
      id: 'd7',
      name: 'Dish 7',
      description: 'Desc 7',
      restaurants: ['nagarjuna'],
    },
  },
};

export const TEST_WAIT_TIME = 50;

export const TEST_USER = {
  name: typeof process !== 'undefined' && process.env.TEST_USER_NAME,
  email: typeof process !== 'undefined' && process.env.TEST_USER_EMAIL,
  password: typeof process !== 'undefined' && process.env.TEST_USER_PASSWORD,
};
