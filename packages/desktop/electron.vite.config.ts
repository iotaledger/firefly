import { defineConfig } from 'electron-vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'node:path'
import { getAppName, APP_PROTOCOL, STAGE, PRODUCT_NAME, APP_ID, KEYCHAIN_SERVICE_NAME_PACKAGED, KEYCHAIN_SERVICE_NAME_NOT_PACKAGED, appNameBase } from './product'
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess'
import tailwindcss from 'tailwindcss'

type Mode = 'none' | 'development' | 'production'
const mode: Mode = (process.env.NODE_ENV as Mode) || 'development'
const isProduction = mode === 'production'

const alias = {
  '@auxiliary': path.resolve(__dirname, '../shared/lib/auxiliary'),
  '@contexts': path.resolve(__dirname, '../shared/lib/contexts'),
  '@components': path.resolve(__dirname, './components/'),
  '@core': path.resolve(__dirname, '../shared/lib/core'),
  '@features': path.resolve(__dirname, './features'),
  '@lib': path.resolve(__dirname, '../shared/lib'),
  '@desktop': path.resolve(__dirname, './lib'),
  '@ui': path.resolve(__dirname, '../shared/components/'),
  '@views': path.resolve(__dirname, './views/'),
}

const define = {
  PLATFORM_LINUX: JSON.stringify(process.platform === 'linux'),
  SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN || ''),
  SENTRY_MAIN_PROCESS: JSON.stringify(true),
  SENTRY_ENVIRONMENT: JSON.stringify(STAGE),
  PRELOAD_SCRIPT: JSON.stringify(false),
  APP_NAME: JSON.stringify(getAppName(isProduction)),
  PRODUCT_NAME: JSON.stringify(PRODUCT_NAME),
  APP_ID: JSON.stringify(APP_ID),
  STAGE: JSON.stringify(STAGE),
  APP_PROTOCOL: JSON.stringify(APP_PROTOCOL),
  AMPLITUDE_API_KEY: JSON.stringify(process.env.AMPLITUDE_API_KEY),
  KEYCHAIN_SERVICE_NAME_PACKAGED: JSON.stringify(KEYCHAIN_SERVICE_NAME_PACKAGED),
  KEYCHAIN_SERVICE_NAME_NOT_PACKAGED: JSON.stringify(KEYCHAIN_SERVICE_NAME_NOT_PACKAGED),
  APP_NAME_BASE: JSON.stringify(appNameBase)
}

export default defineConfig({
  main: {
    resolve: {
      alias
    },
    build: {
      lib: {
        entry: './electron/index.js'
      }
    },
    define,
    plugins: [
      tsconfigPaths(),
    ],
  },
  preload: {
    resolve: {
      alias
    },
    build: {
      lib: {
        entry: './electron/preload.js'
      }
    },
    define,
    plugins: [
      tsconfigPaths(),
    ]
  },
  renderer: {
    base: './',
    resolve: {
      extensions: [".svelte", ".ts", ".js"],
      alias
    },
    define,
    plugins: [
      tsconfigPaths(),
      svelte({
        preprocess: sveltePreprocess({
          sourceMap: false,
          postcss: {
            plugins: [
              tailwindcss('./../shared/tailwind.config.js'),
            ]
          }
        })
      })
    ]
  }
})
