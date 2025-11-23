module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/test/**/*.test.js', '<rootDir>/test/**/*.test.ts'],
    collectCoverageFrom: ['index.js', 'index.ts', 'jq.js', 'jq.ts'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transformIgnorePatterns: [
        'node_modules/(?!(jsdom|parse5|whatwg-url|whatwg-encoding|@xmldom)/)',
    ],
    globals: {
        'ts-jest': {
            tsconfig: {
                allowJs: true,
                esModuleInterop: true,
            },
        },
    },
};
