import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import { DefinePlugin } from 'webpack'
import path from 'path'
import sveltePreprocess from 'svelte-preprocess'
import SentryWebpackPlugin from '@sentry/webpack-plugin'
import { version } from './package.json'
import features from './features/features'
import { Configuration as WebpackConfiguration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import assert from 'assert'
import dotenv from 'dotenv'
import { APP_NAME, APP_ID, APP_PROTOCOL, STAGE } from './product'

dotenv.config() // used to read env vars from an .env file

type Mode = 'none' | 'development' | 'production'
interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration
}

const mode: Mode = (process.env.NODE_ENV as Mode) || 'development'
const prod = mode === 'production'
const hardcodeNodeEnv = typeof process.env.HARDCODE_NODE_ENV !== 'undefined'
const SENTRY = process.env.SENTRY === 'true'

// / ------------------------ Resolve ------------------------

const fallback: { [index: string]: string | false | string[] } = {
    path: false,
    fs: false,
    crypto: false,
    // The Amplitude SDK requires http, https and url polyfills
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    url: require.resolve('url/'),
}

const resolve = {
    alias: {
        svelte: path.dirname(require.resolve('svelte/package.json')),
        '@auxiliary': path.resolve(__dirname, '../shared/lib/auxiliary'),
        '@contexts': path.resolve(__dirname, '../shared/lib/contexts'),
        '@components': path.resolve(__dirname, './components/'),
        '@core': path.resolve(__dirname, '../shared/lib/core'),
        '@features': path.resolve(__dirname, './features'),
        '@lib': path.resolve(__dirname, '../shared/lib'),
        '@desktop': path.resolve(__dirname, './lib'),
        '@ui': path.resolve(__dirname, '../shared/components/'),
        '@views': path.resolve(__dirname, './views/'),
    },
    conditionNames: ['svelte', 'module', 'import', 'require', 'node', 'default'],
    extensions: ['.mjs', '.js', '.ts', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
    fallback,
}

// / ------------------------ Output ------------------------

const output = {
    publicPath: prod ? '../' : '/',
    path: path.join(__dirname, '/public'),
    filename: '[name].js',
    chunkFilename: 'build/[name].[id].js',
}

// / ------------------------ Module rules ------------------------

const mainRules = [
    {
        test: /\.ts$/,
        loader: 'esbuild-loader',
    },
    {
        test: /\.node$/,
        loader: 'node-loader',
        options: {
            name: 'build/[name].[ext]',
        },
    },
]

const rendererRules = [
    {
        test: /\.ts$/,
        loader: 'esbuild-loader',
    },
    {
        test: /\.svelte$/,
        use: {
            loader: 'svelte-loader',
            options: {
                compilerOptions: {
                    dev: !prod,
                },
                emitCss: prod,
                hotReload: !prod,
                preprocess: sveltePreprocess({
                    sourceMap: false,
                    postcss: true,
                }),
            },
        },
    },
    {
        test: /\.(woff|woff2)?$/,
        type: 'asset/resource',
        generator: {
            filename: ({ filename }): { filename: string } => filename.replace('../shared/', ''),
        },
    },
    {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
    },
    {
        // required to prevent errors from Svelte on Webpack 5+
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
            fullySpecified: false,
        },
    },
]

// / ------------------------ Plugins ------------------------

const mainPlugins = [
    new DefinePlugin({
        PLATFORM_LINUX: JSON.stringify(process.platform === 'linux'),
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN || ''),
        SENTRY_MAIN_PROCESS: JSON.stringify(true),
        SENTRY_ENVIRONMENT: JSON.stringify(STAGE),
        PRELOAD_SCRIPT: JSON.stringify(false),
        APP_NAME: JSON.stringify(APP_NAME),
        APP_ID: JSON.stringify(APP_ID),
        'process.env.STAGE': JSON.stringify(STAGE),
        'process.env.APP_PROTOCOL': JSON.stringify(APP_PROTOCOL),
        'process.env.AMPLITUDE_API_KEY': JSON.stringify(process.env.AMPLITUDE_API_KEY),
    }),
]

const rendererPlugins = [
    new CopyPlugin({
        patterns: [
            {
                from: '../shared/assets/**/*',
                // we ignore the fonts since the `asset/resource` handles them
                filter: prod ? (asset) => !asset.includes('fonts') : undefined,
                to({ context, absoluteFilename }) {
                    assert(typeof absoluteFilename === 'string')
                    return path.relative(context, absoluteFilename).replace(/..[\\/]shared[\\/]/g, '')
                },
            },
            {
                from: '../shared/locales/*',
                to() {
                    return 'locales/[name][ext]'
                },
            },
        ],
    }),
    new MiniCssExtractPlugin({
        filename: '[name].css',
    }),
    new DefinePlugin({
        'process.env.PLATFORM': JSON.stringify(process.env.PLATFORM || 'desktop'),
        'process.env.STAGE': JSON.stringify(STAGE),
        features: JSON.stringify(features),
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN || ''),
        SENTRY_MAIN_PROCESS: JSON.stringify(false),
        SENTRY_ENVIRONMENT: JSON.stringify(STAGE),
        PRELOAD_SCRIPT: JSON.stringify(false),
        'process.env.APP_PROTOCOL': JSON.stringify(APP_PROTOCOL),
    }),
]

const preloadPlugins = [
    new DefinePlugin({
        PLATFORM_LINUX: JSON.stringify(process.platform === 'linux'),
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN || ''),
        SENTRY_MAIN_PROCESS: JSON.stringify(false),
        SENTRY_ENVIRONMENT: JSON.stringify(STAGE),
        PRELOAD_SCRIPT: JSON.stringify(true),
        APP_NAME: JSON.stringify(APP_NAME),
        'process.env.STAGE': JSON.stringify(STAGE),
        'process.env.APP_PROTOCOL': JSON.stringify(APP_PROTOCOL),
    }),
]

const sentryPlugins = [
    new SentryWebpackPlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        include: '.',
        release: `${APP_NAME}@${version}`,
        ignoreFile: '.sentrycliignore',
        org: 'iota-foundation-h4',
        project: 'firefly-desktop',
        finalize: false,
        deploy: {
            env: STAGE,
        },
    }),
]

// / ------------------------ Webpack config ------------------------

const webpackConfig: Configuration[] = [
    {
        entry: {
            'build/index': ['./index.js'],
        },
        resolve,
        output,
        module: {
            rules: rendererRules,
        },
        mode,
        plugins: [...rendererPlugins, ...(SENTRY ? sentryPlugins : [])],
        devtool: prod ? (SENTRY ? 'source-map' : false) : 'cheap-module-source-map',
        devServer: {
            hot: true,
            static: {
                directory: path.join(__dirname, 'public'),
                watch: {
                    ignored: path.resolve(__dirname, 'public/build/__storage__'),
                    usePolling: false,
                },
            },
            client: {
                overlay: {
                    errors: true,
                    warnings: false,
                },
            },
        },
    },
    {
        target: 'electron-main',
        entry: {
            'build/main': ['./electron/main.js'],
        },
        resolve,
        output,
        module: {
            rules: mainRules,
        },
        mode,
        plugins: [...mainPlugins, ...(SENTRY ? sentryPlugins : [])],
        devtool: prod ? (SENTRY ? 'source-map' : false) : 'cheap-module-source-map',
        optimization: {
            nodeEnv: hardcodeNodeEnv ? mode : false,
            minimize: true,
        },
    },
    {
        target: 'electron-renderer',
        entry: {
            'build/preload': ['./electron/preload.js'],
            'build/lib/aboutPreload': ['./electron/lib/aboutPreload.js'],
            'build/lib/errorPreload': ['./electron/lib/errorPreload.js'],
        },
        resolve,
        output,
        module: {
            rules: mainRules,
        },
        mode,
        plugins: [...preloadPlugins, ...(SENTRY ? sentryPlugins : [])],
        devtool: prod ? (SENTRY ? 'source-map' : false) : 'cheap-module-source-map',
        optimization: {
            nodeEnv: hardcodeNodeEnv ? mode : false,
            minimize: true,
        },
    },
]

export default webpackConfig
