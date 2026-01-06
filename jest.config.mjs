export default {
    testEnvironment: 'jsdom',
    transform: {
        "^.+\\.(js|jsx|mjs)$": "babel-jest"
    },
    moduleFileExtensions: ["js", "mjs", "jsx", "json", "node"],
    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(test).[tj]s?(x)",
        "**/?(*.)+(test).mjs"
    ],
    testPathIgnorePatterns: ["/node_modules/", "\\.spec\\.js$"],
};
