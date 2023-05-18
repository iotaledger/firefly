import tailwindConfig from 'shared/tailwind.config.js'
import resolveConfig from 'tailwindcss/resolveConfig'

const configColors = resolveConfig(tailwindConfig).theme.colors as Record<string, Record<string, string>>

type Colors = 'blue' | 'lightblue' | 'purple' | 'turquoise' | 'green' | 'yellow' | 'orange' | 'red' | 'pink' | 'gray'
type Shades = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '1000'

interface IColourOptions {
    colors?: Colors[]
    shades?: Shades[]
    colorsToExclude?: Colors[]
    shadesToExclude?: Shades[]
}

const DEFAULT_COLORS: Colors[] = [
    'blue',
    'lightblue',
    'purple',
    'turquoise',
    'green',
    'yellow',
    'orange',
    'red',
    'pink',
    'gray',
]

const DEFAULT_SHADES: Shades[] = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000']

export function getIconColorFromString(string: string = '', colourOptions?: IColourOptions): string {
    const colors: Colors[] = colourOptions?.colors ?? DEFAULT_COLORS
    const shades: Shades[] = colourOptions?.shades ?? DEFAULT_SHADES

    const filteredColors = colors.filter((colour) => !colourOptions?.colorsToExclude?.includes(colour))
    const filteredShades = shades.filter((shade) => !colourOptions?.shadesToExclude?.includes(shade))

    const hexColors: string[] = []
    filteredColors.forEach((colour) => {
        filteredShades.forEach((shade) => {
            if (configColors?.[colour]?.[shade]) {
                hexColors.push(configColors[colour][shade])
            }
        })
    })

    const hash = Array.from(string).reduce((arr, next) => arr + next.charCodeAt(0), 0)
    return hexColors[hash % hexColors.length]?.toString()
}
