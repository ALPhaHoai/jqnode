module.exports = {
    testEnvironment: 'jsdom',
    testMatch: [
        '<rootDir>/test/**/*.test.js'
    ],
    collectCoverageFrom: [
        'index.js',
        'jq.js'
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transformIgnorePatterns: [
        'node_modules/(?!(jsdom|parse5|whatwg-url|whatwg-encoding|@xmldom)/)'
    ],
};
