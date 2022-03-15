/**
 * The specific locale date options, used for formatting dates into text.
 */
export type LocaleDateOptions = Intl.DateTimeFormatOptions & { format?: string; locale?: string }

/**
 * The locale options type definition, used for initializing
 * the internationalization dictionary.
 */
export type LocaleOptions = {
    fallbackLocale: string
    formats?: unknown
    initialLocale?: string | null
    loadingDelay?: number
    warnOnMissingMessages?: boolean
}
