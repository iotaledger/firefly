import { derived, Readable } from 'svelte/store'
import { dictionary } from 'svelte-i18n'

import { appSettings } from '@core/app'

/**
 * The store indicating if the localization dictionary
 * file is loaded or not.
 */
export const isLocaleLoaded: Readable<boolean> = derived(
    [dictionary, appSettings],
    ([$dictionary, $appSettings]) =>
        $dictionary[$appSettings.language] && Object.keys($dictionary[$appSettings.language]).length > 0
)

/**
 * The store indicating what direction a locale
 * should be read, either "left to right" (LTR) or
 * "right to left" (RTL).
 */
export const localeDirection: Readable<string> = derived(
    appSettings,
    () =>
        // TODO: Implement RTL support
        // return appSettings.language === 'ar' ? 'rtl' : 'ltr'
        'ltr'
)
