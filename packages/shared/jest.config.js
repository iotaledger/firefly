const config = {
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json',
        },
    },
    moduleFileExtensions: ['ts', 'js'],
    moduleNameMapper: {
        '@auxiliary/(.*)': '<rootDir>/lib/auxiliary/$1',
        '@contexts/(.*)': '<rootDir>/lib/contexts/$1',
        '@core/(.*)': '<rootDir>/lib/core/$1',
        '@lib/(.*)': '<rootDir>/lib/$1',
    },
    setupFilesAfterEnv: ['./lib/tests/setup.ts'],
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['./node_modules/'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    verbose: true,
}

module.exports = config
