import { get } from 'svelte/store'

import { appSettings } from '@core/app'
import { activeProfile } from '@core/profile'

export function getGroupSeparator(currency: string | undefined = undefined): string {
    const appLanguage = get(appSettings).language

    if (!currency) {
        currency = get(activeProfile)?.settings?.currency
    }

    return (
        Intl.NumberFormat(appLanguage, {
            style: 'currency',
            currency: currency ?? 'USD',
        })
            .formatToParts(1111111)
            .find((part) => part.type === 'group')?.value ?? ','
    )
}
