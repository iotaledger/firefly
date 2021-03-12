import { appSettings } from 'shared/lib/profile'
import { addMessages, dictionary, getLocaleFromNavigator, init, _ } from 'svelte-i18n'
import { derived, get, writable } from 'svelte/store'

/*
 * Code following https://phrase.com/blog/posts/a-step-by-step-guide-to-svelte-localization-with-svelte-i18n-v3/
 */

const MESSAGE_FILE_URL_TEMPLATE = 'locales/{locale}.json'

// Locales our app supports
export const locales = {
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

// Init options: eg locale to show when we don't support the
// requested locale
const INIT_OPTIONS = {
    fallbackLocale: 'en',
    initialLocale: null,
    loadingDelay: 200,
    formats: {},
    warnOnMissingMessages: true,
}

let activeLocale

// Internal store for tracking network
// loading state
const isDownloading = writable(false)

const setupI18n = (options = { withLocale: null }) => {
    // If we're given an explicit locale, we use
    // it. Otherwise, we attempt to auto-detect
    // the user's locale.
    const _locale = supported(options.withLocale || reduceLocale(getLocaleFromNavigator() || 'en'))

    init({ ...INIT_OPTIONS, initialLocale: _locale } as any)

    // Don't re-download translation files
    if (!hasLoadedLocale(_locale)) {
        const messagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', _locale)
        // Download translation file for given locale/language
        return loadJson(messagesFileUrl).then((messages) => {
            activeLocale = _locale
            addMessages(_locale, messages)
            appSettings.set({
                ...get(appSettings),
                language: _locale
            })
            isDownloading.set(false)
        })
    }
}

const isLocaleLoaded = derived(
    [isDownloading, dictionary],
    ([$isDownloading, $dictionary]) =>
        !$isDownloading && $dictionary[activeLocale] && Object.keys($dictionary[activeLocale]).length > 0
)

const hasLoadedLocale = (locale: string) => {
    // If the svelte-i18n dictionary has an entry for the
    // locale, then the locale has already been added
    return get(dictionary)[locale]
}

// Extract the "en" bit from fully qualified
// locales, like "en-US"
function reduceLocale(locale) {
    return locale.replace('_', '-').split('-')[0]
}

// Check to see if the given locale is supported
// by our app. If it isn't, return our app's
// configured fallback locale.
function supported(locale) {
    if (Object.keys(locales).includes(locale)) {
        return locale
    } else {
        return INIT_OPTIONS.fallbackLocale
    }
}

function loadJson(url) {
    return fetch(url).then((response) => response.json())
}

const dir = derived(appSettings, (_appSettings) => {
    return _appSettings.language === 'ar' ? 'rtl' : 'ltr'
})

const localize = get(_) as (string, values?) => string

// We expose the svelte-i18n _ store so that our app has
// a single API for i18n
export { activeLocale, _, setupI18n, dir, isLocaleLoaded, localize }
