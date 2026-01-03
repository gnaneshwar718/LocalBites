export default {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.m?js$': 'babel-jest',
    },
    moduleNameMapper: {
        '^/data/(.*)$': '<rootDir>/public/data/$1',
    },
    testMatch: ['**/src/js/**/*.test.mjs'],
};
