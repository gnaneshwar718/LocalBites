export default {
    testEnvironment: 'jsdom',
    transform: {
        "^.+\\.(js|jsx|mjs)$": "babel-jest"
    },
    moduleFileExtensions: ["js", "mjs", "jsx", "json", "node"],
    testPathIgnorePatterns: ["/node_modules/", ".*\\.spec\\.js$"],
};
