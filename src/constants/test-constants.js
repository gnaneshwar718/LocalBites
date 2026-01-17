export const MOCK_CULTURE_DATA = {
  restaurants: {
    mtr: {
      id: 'mtr',
      name: 'Mavalli Tiffin Rooms',
      location: 'https://maps.google.com/?q=MTR',
    },
    ctr: { id: 'ctr', name: 'CTR - Shri Sagar', location: 'loc2' },
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
      restaurants: ['mtr'],
    },
    d3: {
      id: 'd3',
      name: 'Dish 3',
      description: 'Desc 3',
      restaurants: ['mtr'],
    },
    d4: {
      id: 'd4',
      name: 'Dish 4',
      description: 'Desc 4',
      restaurants: ['mtr'],
    },
    d5: {
      id: 'd5',
      name: 'Dish 5',
      description: 'Desc 5',
      restaurants: ['mtr'],
    },
    d6: {
      id: 'd6',
      name: 'Dish 6',
      description: 'Desc 6',
      restaurants: ['mtr'],
    },
    d7: {
      id: 'd7',
      name: 'Dish 7',
      description: 'Desc 7',
      restaurants: ['mtr'],
    },
  },
};

export const TEST_WAIT_TIME = 50;

export const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123!',
};
