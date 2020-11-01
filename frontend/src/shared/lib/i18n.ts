import { get, derived, writable } from 'svelte/store'
import { _, date, init, locale, number, dictionary, addMessages, getLocaleFromNavigator } from 'svelte-i18n'

const locales = {
    en: 'English'
}

const fallbackLocale = 'en'

export { locales, fallbackLocale }

const MESSAGE_FILE_URL_TEMPLATE = 'locales/{locale}.json'

let _activeLocale: any

const isDownloading = writable(false)

function setupI18n(options: any = {}) {
    const locale_ = supported(options.withLocale || language(getLocaleFromNavigator()))

    init({ initialLocale: locale_ } as any)

    if (!hasLoadedLocale(locale_)) {
        isDownloading.set(true)

        const messagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', locale_)

        return loadJson(messagesFileUrl).then((messages) => {
            _activeLocale = locale_

            addMessages(locale_, messages)

            locale.set(locale_)

            isDownloading.set(false)
        })
    }
}

const isLocaleLoaded = derived(
    [isDownloading, dictionary],
    ([$isDownloading, $dictionary]) =>
        !$isDownloading && $dictionary[_activeLocale] && Object.keys($dictionary[_activeLocale]).length > 0
)

const dir = derived(locale, ($locale) => ($locale === 'ar' ? 'rtl' : 'ltr'))

function loadJson(url: any) {
    return fetch(url).then(
        (response) => response.json())
}

function hasLoadedLocale(locale: any) {
    return get(dictionary)[locale]
}

function language(locale: any) {
    return locale.replace('_', '-').split('-')[0]
}

function supported(locale: any) {
    if (Object.keys(locales).includes(locale)) {
        return locale
    } else {
        return fallbackLocale
    }
}

export { _, setupI18n, isLocaleLoaded, locale, dir, date, number }
