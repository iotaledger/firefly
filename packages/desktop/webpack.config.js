const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { DefinePlugin } = require('webpack')
const path = require('path')
const sveltePreprocess = require('svelte-preprocess')
const SentryWebpackPlugin = require('@sentry/webpack-plugin')

const mode = process.env.NODE_ENV || 'development'
const prod = mode === 'production'
const hardcodeNodeEnv = typeof process.env.HARDCODE_NODE_ENV !== 'undefined'
const version = '1.2.0'
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
    chunkFilename: '[name].[id].js',
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
        SENTRY_MAIN: JSON.stringify(true),
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
        SENTRY_MAIN: JSON.stringify(false),
    }),
]

const preloadPlugins = [
    new DefinePlugin({
        PLATFORM_LINUX: JSON.stringify(process.platform === 'linux'),
        SENTRY_MAIN: JSON.stringify(false),
    }),
]

const sentryPlugins = [
    new SentryWebpackPlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        include: '.',
        release: `firefly-${version}`,
        ignoreFile: '.sentrycliignore',
        ignore: ['node_modules', 'webpack.config.js'],
        org: 'iota-foundation-h4',
        project: 'firefly',
        configFile: 'sentry.properties',
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
        plugins: [...rendererPlugins, ...sentryPlugins],
        devtool: (SENTRY && prod) ? 'source-map' : 'cheap-module-source-map',
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
        plugins: [...mainPlugins, ...sentryPlugins],
        devtool: (SENTRY && prod) ? 'source-map' : 'cheap-module-source-map',
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
        plugins: [...preloadPlugins, ...sentryPlugins],
        devtool: (SENTRY && prod) ? 'source-map' : 'cheap-module-source-map',
        optimization: {
            nodeEnv: hardcodeNodeEnv ? mode : false,
            minimize: true,
        },
    },
]
