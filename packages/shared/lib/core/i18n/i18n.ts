/*
 * Code following https://phrase.com/blog/posts/a-step-by-step-guide-to-svelte-localization-with-svelte-i18n-v3/
 */

import { get } from 'svelte/store'
import { addMessages, dictionary, getLocaleFromNavigator, init, _, getDateFormatter } from 'svelte-i18n'

import { appSettings } from '@core/app'

import { LOCALE_OPTIONS, LANGUAGES } from './constants'
import { LanguageChoice, LocaleDateOptions, LocaleOptions } from './types'

const MESSAGE_FILE_URL_TEMPLATE = 'locales/{locale}.json'

export function setupI18n(options: LocaleOptions = { fallbackLocale: 'en', initialLocale: null }): Promise<unknown> {
    // If we're given an explicit locale, we use
    // it. Otherwise, we attempt to auto-detect
    // the user's locale.
    const _locale = supported(options.initialLocale || reduceLocale(getLocaleFromNavigator() || 'en'))

    init({ ...LOCALE_OPTIONS, initialLocale: _locale } as LocaleOptions)

    // Don't re-download translation files
    if (!hasLocaleEntry(_locale)) {
        const messagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', _locale)
        // Download translation file for given locale/language
        return loadJson(messagesFileUrl).then((messages) => {
            addMessages(_locale, messages)
            appSettings.set({
                ...get(appSettings),
                language: _locale,
            })

            // If we have not loaded "en" make sure we have it as a backup language
            // in case the chosen language does not have all the translations
            if (_locale !== 'en' && !hasLocaleEntry('en')) {
                const messagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', 'en')
                void loadJson(messagesFileUrl).then((messages) => {
                    addMessages('en', messages)
                })
            }
        })
    }
}

function hasLocaleEntry(locale: string): boolean {
    return locale in get(dictionary)
}

function reduceLocale(locale) {
    return locale.replace('_', '-').split('-')[0]
}

function supported(locale) {
    if (Object.keys(LANGUAGES).includes(locale)) {
        return locale
    } else {
        return LOCALE_OPTIONS.fallbackLocale
    }
}

function loadJson(url) {
    return fetch(url).then((response) => response.json())
}

export function setLanguage(language: LanguageChoice): void {
    const locale = Object.keys(LANGUAGES).find((key) => LANGUAGES[key] === language.value)
    appSettings.set({
        ...get(appSettings),
        language: locale,
    })

    void setupI18n({ fallbackLocale: 'en', initialLocale: locale })
}

export function formatDate(date: Date, options: LocaleDateOptions): string {
    return getDateFormatter({ locale: getLocaleFromNavigator(), ...options }).format(date)
}

export const localize = get(_) as (string, values?) => string

// Export the svelte-i18n dictionary
export { _ }
