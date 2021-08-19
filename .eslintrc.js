module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    overrides: [
        {
            files: '**/*.svelte',
            processor: 'svelte3/svelte3',
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 6,
        extraFileExtensions: ['.svelte'],
        project: './tsconfig.lint.json',
        sourceType: 'module',
        tsconfigRootDir: './',
    },
    plugins: ['@typescript-eslint', 'svelte3'],
    rules: {
        'arrow-body-style': 'error',
        'arrow-spacing': 'error',
        'eol-last': 'error',
        'func-call-spacing': 'error',
        indent: ['error', 4, { SwitchCase: 1 }],
        'linebreak-style': 'off', // OFF b/c Windows (Git) puts CRLF line endings
        'no-alert': 'error',
        'no-async-promise-executor': 'off', // OFF b/c used in lib/migration.ts
        'no-case-declarations': 'error',
        'no-console': ['error', { allow: ['error', 'warn'] }],
        'no-control-regex': 'error',
        'no-dupe-keys': 'error',
        'no-empty': 'error',
        'no-extra-boolean-cast': 'error',
        'no-extra-parens': 'off', // OFF b/c reactive dependencies in .svelte files (mostly for errors)
        'no-extra-semi': 'error',
        'no-fallthrough': 'error',
        'no-import-assign': 'error',
        'no-irregular-whitespace': 'off', // OFF b/c special char used in packages/desktop/electron/lib/keychain.js
        'no-prototype-builtins': 'error',
        'no-return-await': 'error',
        'no-trailing-spaces': 'error',
        'no-useless-escape': 'error',
        'no-undef': 'error',
        'no-underscore-dangle': 'off', // OFF b/c this syntax is used for defining local callback methods
        'no-unreachable': 'error',
        'no-unused-export-let': 'off', // OFF b/c troublesome with some .js files in packages/shared
        'no-unused-vars': 'off', // OFF b/c there are simply too many and they're harmless
        'no-var': 'error',
        'prefer-arrow-callback': 'warn',
        'prefer-const': 'warn',
        'prefer-destructuring': 'off', // OFF b/c it's not really correct
        quotes: ['error', 'single'],
        semi: 'off', // OFF b/c we aren't using semicolons
        'space-before-function-paren': 'off', // OFF b/c we aren't using spaces before function parameters / signatures
        'spaced-comment': 'off', // OFF b/c there are lots of comments with mixed formatting - best to leave it

        '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-array-constructor': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/prefer-regexp-exec': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/unbound-method': 'off',
    },
    settings: {
        'svelte3/typescript': () => require('typescript'),
        'svelte3/ignore-styles': () => true,
        'svelte3/ignore-warnings': () => false,
    },
}
