import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import ts from '@rollup/plugin-typescript'
import typescript from 'typescript'
import json from '@rollup/plugin-json'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import { terser } from 'rollup-plugin-terser'
import sveltePreprocess from 'svelte-preprocess'

const isDev = process.env.NODE_ENV === 'development'
const port = 3000

// Plugins definition
const preprocess = sveltePreprocess({
    scss: {
        includePaths: ['src', 'node_modules']
    }
})
const plugins = [
    json(),
    svelte({
        dev: isDev,
        extensions: ['.svelte'],
        css: (css) => {
            css.write('public/build/bundle.css')
        },
        preprocess
    }),
    resolve({
        browser: true,
        dedupe: ['svelte']
    }),
    ts({ sourceMap: isDev, typescript }),
    commonjs()
]

if (isDev) {
    plugins.push(
        serve({
            contentBase: ['public', 'node_modules/shared-modules'],
            historyApiFallback: true, // for SPAs
            port
        }),
        livereload({ watch: './public' })
    )
} else {
    plugins.push(terser({ sourcemap: isDev }))
}

module.exports = {
    input: 'main.js',
    output: {
        name: 'bundle',
        file: 'public/build/bundle.js',
        sourcemap: isDev,
        format: 'iife'
    },
    moduleContext: (id) => {
        // In order to match native module behaviour, Rollup
        // sets `this` as `undefined` at the top level of
        // modules. Rollup also outputs a warning if a module
        // tries to access `this` at the top level. The
        // following modules use `this` at the top level and
        // expect it to be the global `window` object, so we
        // tell Rollup to set `this = window` for these modules.
        const thisAsWindowForModules = [
            'node_modules/intl-messageformat/lib/core.js',
            'node_modules/intl-messageformat/lib/compiler.js',
            'node_modules/intl-messageformat/lib/formatters.js',
            'node_modules/intl-format-cache/lib/index.js',
            'node_modules/intl-messageformat-parser/lib/parser.js',
            'node_modules/intl-messageformat-parser/lib/skeleton.js',
            'node_modules/intl-messageformat-parser/lib/normalize.js'
        ]

        if (thisAsWindowForModules.some((id_) => id.trimRight().endsWith(id_))) {
            return 'window'
        }
    },
    plugins
}
