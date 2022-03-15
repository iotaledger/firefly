import { derived } from 'svelte/store'
import { dictionary } from 'svelte-i18n'

import { appSettings } from '@lib/appSettings'

/**
 * The store indicating whether the locale dictionary has
 * been loaded or not.
 */
export const isLocaleLoaded = derived([dictionary, appSettings], ([$dictionary, $appSettings]) => {
    if (!$dictionary || !$appSettings) return false

    return $dictionary[$appSettings.language] && Object.keys($dictionary[$appSettings.language]).length > 0
})

/**
 * The store indicating the directionality of the text in
 * Firefly, either left-to-right (ltr) or right-to-left (rtl).
 */
export const localeDirectionality = derived(
    appSettings,
    (_appSettings) =>
        // TODO: Implement RTL support
        // return appSettings.language === 'ar' ? 'rtl' : 'ltr'
        'ltr'
)
