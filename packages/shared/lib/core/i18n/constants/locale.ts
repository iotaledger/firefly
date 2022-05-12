import { LocaleOptions } from '../types'

/**
 * The default locale options, useful for when a specific
 * translation is not supported.
 */
export const DEFAULT_LOCALE_OPTIONS: LocaleOptions = {
    fallbackLocale: 'en',
    initialLocale: null,
    loadingDelay: 200,
    formats: {},
    warnOnMissingMessages: true,
}

/**
 * The available locales supported by the app.
 */
export const SUPPORTED_LOCALES = {
    en: 'English',
    af: 'Afrikaans',
    ar: 'Arabic',
    bg: 'Bulgarian',
    ca: 'Catalan',
    cs: 'Czech',
    da: 'Danish',
    de: 'German',
    el: 'Greek',
    'es-ES': 'Spanish (Spain)',
    'es-LA': 'Spanish (Latin America)',
    fa: 'Persian',
    fi: 'Finnish',
    fr: 'French',
    he: 'Hebrew',
    hi: 'Hindi',
    hr: 'Croatian',
    hu: 'Hungarian',
    id: 'Indonesian',
    it: 'Italian',
    ja: 'Japanese',
    ko: 'Korean',
    ku: 'Kurmanji (Kurdish)',
    nl: 'Dutch',
    no: 'Norwegian',
    pl: 'Polish',
    'pt-BR': 'Portuguese (Brazil)',
    'pt-PT': 'Portuguese (Portugal)',
    ro: 'Romanian',
    ru: 'Russian',
    sr: 'Serbian (Cyrillic)',
    sv: 'Swedish',
    tr: 'Turkish',
    uk: 'Ukrainian',
    ur: 'Urdu (Pakistan)',
    vi: 'Vietnamese',
    'zh-CN': 'Chinese (Simplified)',
    'zh-TW': 'Chinese (Traditional)',
}
