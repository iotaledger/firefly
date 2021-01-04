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
import copy from 'rollup-plugin-copy'

import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'

const path = require('path')

const isDev = process.env.NODE_ENV === 'development'
const port = 3000
const projectRootDir = path.resolve(__dirname)

// Plugins definition
const plugins = [
    json(),
    svelte({
        dev: isDev,
        extensions: ['.svelte'],
        css: (css) => {
            css.write('bundle.css')
        },
        preprocess: sveltePreprocess({
            postcss: true
        })
    }),
    resolve({
        browser: true,
        dedupe: ['svelte']
    }),
    ts({ sourceMap: isDev, typescript, include: ['../shared/**/*.ts'] }),
    commonjs(),
    copy({
        targets: [
            { src: '../shared/assets/*', dest: './public/assets/' },
            { src: '../shared/locales/*', dest: './public/locales/' }
        ],
        flatten: true
    }),
    globals(),
    builtins()
]

if (isDev) {
    plugins.push(
        serve({
            contentBase: ['public'],
            historyApiFallback: true, // for SPAs
            port
        }),
        livereload({ watch: './public' })
    )
} else {
    plugins.push(terser())
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