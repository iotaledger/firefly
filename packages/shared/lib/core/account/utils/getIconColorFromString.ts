import tailwindConfig from 'shared/tailwind.config.js'
import resolveConfig from 'tailwindcss/resolveConfig'

const configColors = resolveConfig(tailwindConfig).theme.colors

export function getIconColorFromString(string: string = ''): string {
    const hash = Array.from(string).reduce((arr, next) => arr + next.charCodeAt(0), 0)
    const iconColors = []
    delete configColors?.['gray']
    Object.values(configColors)
        .filter((colorSet) => colorSet['500'])
        .forEach((color) => {
            iconColors.push(color['500'])
            iconColors.push(color['600'])
            iconColors.push(color['700'])
            iconColors.push(color['800'])
        })
    return iconColors[hash % iconColors.length].toString()
}
