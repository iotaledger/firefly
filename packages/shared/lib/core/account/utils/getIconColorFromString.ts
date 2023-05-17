import tailwindConfig from 'shared/tailwind.config.js'
import resolveConfig from 'tailwindcss/resolveConfig'

const configColors = resolveConfig(tailwindConfig).theme.colors as Record<string, Record<string, string>>

type Colours = 'blue' | 'lightblue' | 'purple' | 'turquoise' | 'green' | 'yellow' | 'orange' | 'red' | 'pink' | 'gray'
type Shades = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '1000'

interface IColourOptions {
    colours?: Colours[]
    shades?: Shades[]
    coloursToExclude?: Colours[]
    shadesToExclude?: Shades[]
}

const DEFAULT_COLOUR_OPTIONS: IColourOptions = {
    colours: ['blue', 'lightblue', 'purple', 'turquoise', 'green', 'yellow', 'orange', 'red', 'pink', 'gray'],
    shades: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'],
}

export function getIconColorFromString(
    string: string = '',
    colourOptions: IColourOptions = DEFAULT_COLOUR_OPTIONS
): string {
    const colours = colourOptions.colours ?? DEFAULT_COLOUR_OPTIONS.colours
    const shades = colourOptions.shades ?? DEFAULT_COLOUR_OPTIONS.shades

    const filteredColours = colours?.filter((colour) => !colourOptions.coloursToExclude?.includes(colour))
    const filteredShades = shades?.filter((shade) => !colourOptions.shadesToExclude?.includes(shade))

    const hexColours: string[] = []
    filteredColours?.forEach((colour) => {
        filteredShades?.forEach((shade) => {
            if (configColors?.[colour]?.[shade]) {
                hexColours.push(configColors?.[colour]?.[shade])
            }
        })
    })

    const hash = Array.from(string).reduce((arr, next) => arr + next.charCodeAt(0), 0)
    return hexColours[hash % hexColours.length]?.toString()
}
