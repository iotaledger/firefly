import { Formats } from 'intl-messageformat'

/**
 * Type for the locale function from Svelte's i18n store.
 */
export type Locale = (path: string, args?: LocaleArgs) => string

/**
 * Type for providing dynamic data to the locale function.
 */
export type LocaleArgs = Record<string, LocaleValue>

type LocaleValue = string | number | unknown

export interface LocaleOptions {
    fallbackLocale: string
    formats?: unknown
    initialLocale?: string | null
    loadingDelay?: number
    warnOnMissingMessages?: boolean
}
