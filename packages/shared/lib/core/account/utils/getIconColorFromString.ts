import tailwindConfig from 'shared/tailwind.config.js'
import resolveConfig from 'tailwindcss/resolveConfig'

const configColors = resolveConfig(tailwindConfig).theme.colors as Record<string, Record<string, string>>

export function getIconColorFromString(string: string = '', includedShades: string[] = ['500']): string {
    const hash = Array.from(string).reduce((arr, next) => arr + next.charCodeAt(0), 0)
    const iconColors: string[] = []
    delete configColors?.['gray']
    Object.values(configColors)
        .filter((colorSet) => colorSet['500'])
        .forEach((color) => {
            includedShades.forEach((shade) => iconColors.push(color[shade]))
        })
    return iconColors[hash % iconColors.length].toString()
}
