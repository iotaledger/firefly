module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [
        // 'eslint:recommended',
        // 'plugin:import/typescript',
        // 'plugin:@typescript-eslint/eslint-recommended',
        // 'plugin:@typescript-eslint/recommended',
        // 'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ],
    ignorePatterns: ['**/.eslintrc.js', '**/node_modules'],
    overrides: [
        {
            files: '**/*.svelte',
            processor: 'svelte3/svelte3',
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        extraFileExtensions: 'svelte',
        project: __dirname + '/tsconfig.json',
        sourceType: 'module',
        tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint', 'import', 'svelte3'],
    rules: {},
    settings: {
        'svelte3/ignore-styles': () => true,
        'svelte3/typescript': true,
    },
}
