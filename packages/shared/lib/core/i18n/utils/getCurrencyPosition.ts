import { get } from 'svelte/store'

import { appSettings } from '@core/app'

export function getCurrencyPosition(): 'left' | 'right' {
    const appLanguage = get(appSettings).language

    const format = Intl.NumberFormat(appLanguage, {
        style: 'currency',
        currency: 'USD',
    }).formatToParts(1.1)

    return format.findIndex((p) => p.type === 'currency') === 0 ? 'left' : 'right'
}
