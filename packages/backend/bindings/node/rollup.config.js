// rollup.config.js
import {
  terser
} from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import sucrase from '@rollup/plugin-sucrase'
import pkg from './package.json'

export default {
  input: {
    index: './index.ts'
  },
  treeshake: true,
  perf: true,
  output: {
    dir: './dist',
    entryFileNames: '[name].js',
    format: 'cjs',
    exports: 'named',
    globals: {}
  },
  plugins: [
    commonjs({}),
    resolve({
      // pass custom options to the resolve plugin
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    sucrase({
      exclude: ['node_modules'],
      transforms: ['typescript']
    }),
    terser()
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  watch: {
    chokidar: true,
    include: '*.ts',
    exclude: 'node_modules/**'
  }
}