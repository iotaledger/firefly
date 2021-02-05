const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const sveltePreprocess = require('svelte-preprocess');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

/// ------------------------ Resolve ------------------------

const resolve = {
  alias: {
    svelte: path.dirname(require.resolve('svelte/package.json'))
  },
  extensions: ['.mjs', '.js', '.ts', '.svelte'],
  mainFields: ['svelte', 'browser', 'module', 'main'],
  fallback: {
    path: false,
    fs: false
  }
}

/// ------------------------ Output ------------------------

const output = {
  publicPath: prod ? '../' : '/',
  path: path.join(__dirname, '/public'),
  filename: '[name].js',
  chunkFilename: '[name].[id].js'
}

/// ------------------------ Module rules ------------------------

const mainRules = [
  {
    test: /\.ts$/,
    loader: 'ts-loader',
    exclude: /node_modules/
  },
  {
    test: /\.node$/,
    loader: 'node-loader',
    options: {
      name: 'build/[name].[ext]'
    },
  }
]

const rendererRules = [
  {
    test: /\.ts$/,
    loader: 'ts-loader',
    exclude: /node_modules/
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
          dev: !prod
        },
        emitCss: prod,
        hotReload: !prod,
        preprocess: sveltePreprocess({
          sourceMap: false,
          postcss: true
        })
      }
    }
  },
  {
    test: /\.(woff|woff2)?$/,
    type: 'asset/resource',
    generator: {
      filename: 'assets/fonts/[hash][ext][query]'
    }
  },
  {
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader'
    ]
  },
  {
    // required to prevent errors from Svelte on Webpack 5+
    test: /node_modules\/svelte\/.*\.mjs$/,
    resolve: {
      fullySpecified: false
    }
  }
]

/// ------------------------ Plugins ------------------------

const mainPlugins = []

const rendererPlugins = [
  new CopyPlugin({
    patterns: [
      {
        from: '../shared/assets/**/*',
        // we ignore the fonts since the `asset/resource` handles them
        filter: (asset) => !asset.includes('fonts'),
        to({ context, absoluteFilename }) {
          return path.relative(context, absoluteFilename).replace('../shared/', '')
        }
      },
      {
        from: '../shared/locales/*',
        to() {
          return 'locales/[name].[ext]'
        }
      }
    ]
  }),
  new MiniCssExtractPlugin({
    filename: '[name].css'
  })
]

/// ------------------------ Webpack config ------------------------

module.exports = [
  {
    entry: {
      'build/index': ['./main.js']
    },
    resolve,
    output,
    module: {
      rules: rendererRules
    },
    mode,
    plugins: rendererPlugins,
    devtool: prod ? false : 'cheap-module-source-map',
    devServer: {
      hot: true
    }
  },
  {
    target: 'electron-main',
    entry: {
      'build/main': ['./electron/main.js'],
      'build/preload': ['./electron/preload.js']
    },
    resolve,
    output,
    module: {
      rules: mainRules
    },
    mode,
    plugins: mainPlugins,
    devtool: prod ? false : 'cheap-module-source-map'
  }
]
