import path from 'node:path'
import tailwindcss from 'tailwindcss'
import postcssUrl from 'postcss-url'

const mode = process.env.NODE_ENV || 'development'

export const plugins = [
    tailwindcss('./../shared/tailwind.config.js'),
    postcssUrl({
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
]