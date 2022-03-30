/**
 * The type for locale options, useful for initializing
 * internationalization with a specific configuration.
 */
export type LocaleOptions = {
    fallbackLocale: string
    formats?: unknown
    initialLocale?: string | null
    loadingDelay?: number
    warnOnMissingMessages?: boolean
}
