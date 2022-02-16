const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { DefinePlugin } = require('webpack')
const path = require('path')
const sveltePreprocess = require('svelte-preprocess')
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const { version } = require('./package.json')

const mode = process.env.NODE_ENV || 'development'
const prod = mode === 'production'
const hardcodeNodeEnv = typeof process.env.HARDCODE_NODE_ENV !== 'undefined'
const SENTRY = process.env.SENTRY === 'true'

// / ------------------------ Resolve ------------------------

const resolve = {
    alias: {
        svelte: path.dirname(require.resolve('svelte/package.json')),
    },
    extensions: ['.mjs', '.js', '.ts', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
    fallback: {
        path: false,
        fs: false,
    },
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
        loader: 'ts-loader',
        exclude: /node_modules/,
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
        loader: 'ts-loader',
        exclude: /node_modules/,
    },
    {
        test: /\.json$/,
        loader: 'json-loader',
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
            filename: ({ filename }) => filename.replace('../shared/', ''),
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
        SENTRY_ENVIRONMENT: JSON.stringify(process.env.SENTRY_ENVIRONMENT || ''),
        PRELOAD_SCRIPT: JSON.stringify(false),
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
                    return path.relative(context, absoluteFilename).replace(/..[\\/]shared[\\/]/g, '')
                },
            },
            {
                from: '../shared/locales/*',
                to() {
                    return 'locales/[name].[ext]'
                },
            },
        ],
    }),
    new MiniCssExtractPlugin({
        filename: '[name].css',
    }),
    new DefinePlugin({
        devMode: JSON.stringify(mode === 'development'),
        'process.env.PLATFORM': JSON.stringify(process.env.PLATFORM || 'desktop'),
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN || ''),
        SENTRY_MAIN_PROCESS: JSON.stringify(false),
        SENTRY_ENVIRONMENT: JSON.stringify(process.env.SENTRY_ENVIRONMENT || ''),
        PRELOAD_SCRIPT: JSON.stringify(false),
    }),
]

const preloadPlugins = [
    new DefinePlugin({
        PLATFORM_LINUX: JSON.stringify(process.platform === 'linux'),
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN || ''),
        SENTRY_MAIN_PROCESS: JSON.stringify(false),
        SENTRY_ENVIRONMENT: JSON.stringify(process.env.SENTRY_ENVIRONMENT || ''),
        PRELOAD_SCRIPT: JSON.stringify(true),
    }),
]

const sentryPlugins = [
    new SentryWebpackPlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        include: '.',
        release: `Firefly@${version}`,
        ignoreFile: '.sentrycliignore',
        org: 'iota-foundation-h4',
        project: `firefly-${process.env.SENTRY_ENVIRONMENT}-desktop`,
        finalize: false,
    }),
]

// / ------------------------ Webpack config ------------------------

module.exports = [
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
        externals: {
            argon2: 'commonjs argon2',
        },
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
