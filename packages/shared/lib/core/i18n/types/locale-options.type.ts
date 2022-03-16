export type LocaleDateOptions = Intl.DateTimeFormatOptions & { format?: string; locale?: string }

export type LocaleOptions = {
    fallbackLocale: string
    formats?: unknown
    initialLocale?: string | null
    loadingDelay?: number
    warnOnMissingMessages?: boolean
}
