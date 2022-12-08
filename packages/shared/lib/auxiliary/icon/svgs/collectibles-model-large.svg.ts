import { ISvg } from '../interfaces'

const strokeWidth = 0.5

export const COLLECTIBLES_MODEL_LARGE_SVG: ISvg = {
    width: 24,
    height: 24,
    path: [
        {
            d: 'M17.4098 11.5082C17.4098 8.52042 14.9877 6.09836 11.9999 6.09836C9.01215 6.09836 6.59009 8.52042 6.59009 11.5082C6.59009 14.496 9.01215 16.918 11.9999 16.918C14.9877 16.918 17.4098 14.496 17.4098 11.5082Z',
            fillPriority: 'secondary',
        },
        {
            d: 'M12 9.2084L13.9917 10.3583V12.6581L12 13.808L10.0083 12.6581V10.3583L12 9.2084Z',
            fillPriority: 'secondary',
            strokeWidth,
        },
        {
            d: 'M10.1311 10.4262L11.9137 11.3588M11.9137 11.3588L13.8688 10.4262M11.9137 11.3588V13.5738',
            fillPriority: 'secondary',
            strokeWidth,
        },
    ],
}
