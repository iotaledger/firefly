import { get } from 'svelte/store'

import { appSettings } from '@core/app'
import { activeProfile } from '@core/profile'

export function formatCurrency(
    value: number,
    currency: string | undefined = undefined,
    minDecimals: number | undefined = undefined,
    maxDecimals: number | undefined = undefined,
    grouped: boolean = false
): string {
    if (Number.isNaN(value)) {
        return ''
    }

    const appLanguage = get(appSettings).language

    if (!currency) {
        currency = get(activeProfile)?.settings?.marketCurrency
    }

    const parts = Intl.NumberFormat(appLanguage, {
        style: 'currency',
        currency: currency ?? 'USD',
        currencyDisplay: 'symbol',
        minimumFractionDigits: minDecimals ?? 2,
        maximumFractionDigits: maxDecimals,
        useGrouping: grouped,
    }).formatToParts(value)

    // Default symbol usage does not always include a literal beside
    // the
    const curIndex = parts.findIndex((p) => p.type === 'currency')
    if (curIndex >= 0) {
        if (curIndex === 0) {
            if (parts[curIndex + 1].type !== 'literal') {
                parts.splice(curIndex + 1, 0, { type: 'literal', value: ' ' })
            }
        } else if (parts[curIndex - 1].type !== 'literal') {
            parts.splice(curIndex, 0, { type: 'literal', value: ' ' })
        }
    }

    return parts.map((p) => p.value).join('')
}
