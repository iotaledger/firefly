import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import { DefinePlugin } from 'webpack'
import path from 'path'
import sveltePreprocess from 'svelte-preprocess'
import { Configuration as WebpackConfiguration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import features from './features/features'
import assert from 'assert'

type Mode = 'none' | 'development' | 'production'
interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration
}
const mode: Mode = (process.env.NODE_ENV as Mode) || 'development'
const prod = mode === 'production'

// ------------------------ Resolve ------------------------

const fallback: { [index: string]: string | false | string[] } = {
    path: false,
    fs: false,
    crypto: false,
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
        '@ui': path.resolve(__dirname, '../shared/components/'),
        '@views': path.resolve(__dirname, './views/'),
        '@': path.resolve(__dirname, './lib/'),
    },
    extensions: ['.mjs', '.js', '.ts', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
    fallback,
}

// ------------------------ Output ------------------------
const output = {
    publicPath: prod ? '../' : '/',
    path: path.join(__dirname, '/public'),
    filename: '[name].js',
    chunkFilename: 'build/[name].[id].js',
}

// ------------------------ Module rules ------------------------
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

// ------------------------ Plugins ------------------------
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
        features: JSON.stringify(features),
        'process.env.PLATFORM': JSON.stringify(process.env.PLATFORM),
        'process.env.STAGE': JSON.stringify(process.env.STAGE),
    }),
]

// ------------------------ Webpack config ------------------------
const webpackConfig: Configuration[] = [
    {
        entry: {
            'build/index': ['./main.js'],
        },
        resolve,
        output,
        module: {
            rules: rendererRules,
        },
        mode,
        plugins: rendererPlugins,
        devtool: prod ? false : 'cheap-module-source-map',
        devServer: {
            hot: true,
            static: path.join(__dirname, 'public'),
            host: '0.0.0.0',
            client: {
                reconnect: true,
                progress: true,
                overlay: {
                    errors: true,
                    warnings: false,
                },
            },
        },
    },
]

export default webpackConfig
