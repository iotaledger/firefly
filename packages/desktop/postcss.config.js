const path = require('path')

const mode = process.env.NODE_ENV || 'development';

module.exports = {
    plugins: [
        require('tailwindcss')('./../shared/tailwind.config.js'),
        require('postcss-url')({
            url: mode === 'production' ? (asset) => {
                return path.relative(__dirname, asset.absolutePath).replace('..', '../shared')
            } : undefined
        })
    ],
}
