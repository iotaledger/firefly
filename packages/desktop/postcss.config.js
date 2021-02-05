// TODO purge
const path = require('path')

module.exports = {
    plugins: [
        require('tailwindcss')('./../shared/tailwind.config.js'),
        require('postcss-url')({
            url(asset) {
                return path.relative(__dirname, asset.absolutePath).replace('..', '../shared')
            }
        })
    ],
}
