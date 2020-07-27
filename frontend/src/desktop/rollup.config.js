import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import { terser } from 'rollup-plugin-terser';

const isDev = process.env.NODE_ENV === 'development';
const port = 3000;

// Plugins definition
const plugins = [
    svelte({
        dev: isDev,
        extensions: ['.svelte'],
        css: css => {
            css.write('public/build/bundle.css');
        }
    }),
    resolve({
        browser: true,
        dedupe: ['svelte'],
    }),
    commonjs()
];

if (isDev) {
    plugins.push(
        serve({
            contentBase: './public',
            historyApiFallback: true, // for SPAs
            port,
        }),
        livereload({ watch: './public' })
    );
} else {
    plugins.push(terser({ sourcemap: isDev }));
}

module.exports = {
    input: 'main.js',
    output: {
        name: 'bundle',
        file: 'public/build/bundle.js',
        sourcemap: isDev,
        format: 'iife',
    },
    plugins,
};
