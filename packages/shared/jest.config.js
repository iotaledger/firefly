const config = {
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json',
        },
    },
    moduleFileExtensions: ['ts', 'js'],
    setupFilesAfterEnv: ['./lib/tests/setup.ts'],
    testEnvironment: 'jsdom',
    testMatch: ['**/tests/**/*.+(test).+(ts|js)'],
    testPathIgnorePatterns: ['./node_modules/'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    verbose: true,
}

module.exports = config
