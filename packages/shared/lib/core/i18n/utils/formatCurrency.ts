import { get } from 'svelte/store'

import { appSettings } from '@core/app'
import { activeProfile } from '@core/profile'

export function formatCurrency(
    value: number,
    currency: string | undefined = undefined,
    grouped: boolean = false
): string {
    if (Number.isNaN(value)) {
        return ''
    }

    const appLanguage = get(appSettings).language

    if (!currency) {
        currency = get(activeProfile)?.settings?.marketCurrency
    }

    if (value < 1) {
        value = Number(value.toPrecision(2))
    } else {
        value = Number(value.toFixed(2))
    }

    const formatter = Intl.NumberFormat(appLanguage, {
        style: 'currency',
        currency: currency ?? 'USD',
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2,
        maximumFractionDigits: 20,
        useGrouping: grouped,
    })

    return formatter.format(value)
}
