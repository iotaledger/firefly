const config = {
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json',
        },
    },
    moduleFileExtensions: ['ts', 'js'],
    moduleNameMapper: {
        '@common/(.*)': '<rootDir>/lib/common/$1',
        '@core/(.*)': '<rootDir>/lib/core/$1',
        '@lib/(.*)': '<rootDir>/lib/$1',
    },
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
