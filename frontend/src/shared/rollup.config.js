// import svelte from 'rollup-plugin-svelte'
// import commonjs from '@rollup/plugin-commonjs'
// import json from '@rollup/plugin-json'
// import resolve from '@rollup/plugin-node-resolve'
// import ts from '@rollup/plugin-typescript'
// import typescript from 'typescript'

// const pkg = require('./package.json')
// const isDev = true

// const configs = {
//     lib: {
//         input: ['lib/index.ts'],
//         output: [{ file: `out/lib/index.js`, name: 'index', format: 'umd', sourcemap: true }],
//         // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
//         external: [],
//         moduleContext: (id) => {
//             // In order to match native module behaviour, Rollup
//             // sets `this` as `undefined` at the top level of
//             // modules. Rollup also outputs a warning if a module
//             // tries to access `this` at the top level. The
//             // following modules use `this` at the top level and
//             // expect it to be the global `window` object, so we
//             // tell Rollup to set `this = window` for these modules.
//             const thisAsWindowForModules = [
//                 'node_modules/intl-messageformat/lib/core.js',
//                 'node_modules/intl-messageformat/lib/compiler.js',
//                 'node_modules/intl-messageformat/lib/formatters.js',
//                 'node_modules/intl-format-cache/lib/index.js',
//                 'node_modules/intl-messageformat-parser/lib/parser.js',
//                 'node_modules/intl-messageformat-parser/lib/skeleton.js',
//                 'node_modules/intl-messageformat-parser/lib/normalize.js'
//             ]

//             if (thisAsWindowForModules.some((id_) => id.trimRight().endsWith(id_))) {
//                 return 'window'
//             }
//         },
//         plugins: [
//             // Allow json resolution
//             json(),
//             // Compile TypeScript files
//             ts({ sourceMap: isDev, typescript }),
//             // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
//             commonjs(),
//             // Allow node_modules resolution, so you can use 'external' to control
//             // which external modules to include in the bundle
//             // https://github.com/rollup/rollup-plugin-node-resolve#usage
//             resolve()
//         ]
//     }
// }

// export default ({ configTarget }) =>
//     configTarget
//         ? configTarget
//               .split(',')
//               .map((x) => x.trim())
//               .map((x) => configs[x])
//               .flat()
//         : Object.values(configs).flat()
