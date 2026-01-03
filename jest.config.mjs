export default {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.m?js$': 'babel-jest',
    },
    testMatch: ['**/src/js/**/*.test.mjs'],
};
