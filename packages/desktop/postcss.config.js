const path = require('path')

const mode = process.env.NODE_ENV || 'development'

module.exports = {
    plugins: [
        require('tailwindcss')('./../shared/tailwind.config.js'),
        require('postcss-url')({
            url:
                mode === 'production'
                    ? (asset) =>
                          path
                              .relative(__dirname, asset.absolutePath)
                              .replace('..', '../shared')
                              // on Windows the path resolution doesn't work unless we change the path separator
                              .replace(/\\/g, '/')
                    : undefined,
        }),
    ],
}
