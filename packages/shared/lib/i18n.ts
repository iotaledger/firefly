import { get, derived, writable } from 'svelte/store'
import { locale } from 'shared/lib/app'
import { getLocaleFromNavigator, addMessages, dictionary, _, init } from 'svelte-i18n'

/*
 * Code following https://phrase.com/blog/posts/a-step-by-step-guide-to-svelte-localization-with-svelte-i18n-v3/
 */

const MESSAGE_FILE_URL_TEMPLATE = 'locales/{locale}.json'

// Locales our app supports
const locales = {
    en: 'English',
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

let _activeLocale

// Internal store for tracking network
// loading state
const isDownloading = writable(false)

const setupI18n = (options = { withLocale: null }) => {
    // If we're given an explicit locale, we use
    // it. Otherwise, we attempt to auto-detect
    // the user's locale.
    const _locale = supported(options.withLocale || get(locale) || language(getLocaleFromNavigator()))

    init({ ...INIT_OPTIONS, initialLocale: _locale } as any)

    // Don't re-download translation files
    if (!hasLoadedLocale(_locale)) {
        const messagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', _locale)
        // Download translation file for given locale/language
        return loadJson(messagesFileUrl).then((messages) => {
            _activeLocale = _locale
            addMessages(_locale, messages)
            locale.set(_locale)
            isDownloading.set(false)
        })
    }
}

const isLocaleLoaded = derived(
    [isDownloading, dictionary],
    ([$isDownloading, $dictionary]) =>
        !$isDownloading && $dictionary[_activeLocale] && Object.keys($dictionary[_activeLocale]).length > 0
)

const hasLoadedLocale = (locale: string) => {
    // If the svelte-i18n dictionary has an entry for the
    // locale, then the locale has already been added
    return get(dictionary)[locale]
}

// Extract the "en" bit from fully qualified
// locales, like "en-US"
function language(locale) {
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

const dir = derived(locale, ($locale) => ($locale === 'ar' ? 'rtl' : 'ltr'))

// We expose the svelte-i18n _ store so that our app has
// a single API for i18n
export { _, setupI18n, dir, isLocaleLoaded }
