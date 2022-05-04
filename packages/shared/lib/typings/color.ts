import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from 'shared/tailwind.config.js'

const configColors = resolveConfig(tailwindConfig).theme.colors

export enum AccountColor {
    Blue = configColors['blue']['500'],
    LightBlue = configColors['lightblue']['500'],
    Purple = configColors['purple']['500'],
    Turquoise = configColors['turquoise']['500'],
    Green = configColors['green']['500'],
    Yellow = configColors['yellow']['500'],
    Orange = configColors['orange']['500'],
    Red = configColors['red']['500'],
    Pink = configColors['pink']['500'],
}
