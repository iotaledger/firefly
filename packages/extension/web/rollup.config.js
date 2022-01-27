import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy'
import { base64 } from 'rollup-plugin-base64'

const doTerser = false

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

function makeConfig({
	input, outputFile, name, isSvelte, hasWasm
}) {
	return {
		input: input,
		output: {
			sourcemap: true,
			format: 'iife',
			name: name,
			file: outputFile
		},
		plugins: [
			isSvelte && svelte({
				// enable run-time checks when not in production
				dev: !production,
				// we'll extract any component CSS out into
				// a separate file - better for performance
				css: css => {
					css.write('bundle.css');
				},
				preprocess: sveltePreprocess(),
			}),

			isSvelte && copy({
				targets: [
					{ src: name+'/public/img/**/*', dest: name+'/public/build/img' },
				]
			}),

			hasWasm && base64({ include: "**/*.wasm" }),

			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			isSvelte ? resolve({
				browser: true,
				dedupe: ['svelte']
			}) : resolve(),
			commonjs(),
			typescript({
				sourceMap: !production,
				inlineSources: !production
			}),

			// In dev mode, call `npm run start` once
			// the bundle has been generated
			isSvelte && !production && serve(),

			// Watch the `public` directory and refresh the
			// browser on changes when not in production
			isSvelte && !production && livereload('popup/public'),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && doTerser && terser()
		],
		watch: {
			clearScreen: false
		}
	}
}

export default [
	makeConfig({
		input: 'popup/src/main.ts',
		outputFile: 'popup/public/build/bundle.js',
		name: 'popup',
		isSvelte: true
	}),
	makeConfig({
		input: 'confirm/src/main.ts',
		outputFile: 'confirm/public/build/bundle.js',
		name: 'confirm',
		isSvelte: true
	}),
	makeConfig({
		name: 'content',
		input: 'content/index.ts',
		outputFile: 'build/content.js'
	}),
	makeConfig({
		name: 'inpage',
		input: 'inpage/index.ts',
		outputFile: 'build/inpage.js'
	}),
	makeConfig({
		name: 'background',
		input: 'background/index.ts',
		outputFile: 'build/background.js',
		hasWasm: true
	}),
];
