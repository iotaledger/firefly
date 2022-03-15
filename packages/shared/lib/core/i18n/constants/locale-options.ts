import { LocaleOptions } from '@core/i18n'

/**
 * The default internationalization options, used for when
 * a specific locale isn't supported.
 */
export const LOCALE_OPTIONS: LocaleOptions = {
    fallbackLocale: 'en',
    initialLocale: null,
    loadingDelay: 200,
    formats: {},
    warnOnMissingMessages: true,
}
