import { Writable, get } from 'svelte/store'
import { addMessages, dictionary, getLocaleFromNavigator, init, _, getDateFormatter } from 'svelte-i18n'

import { appSettings } from '@core/app/stores'

import { DEFAULT_LOCALE_OPTIONS, SUPPORTED_LOCALES } from './constants'
import { LocaleOptions } from './types'

/*
 * Code following https://phrase.com/blog/posts/a-step-by-step-guide-to-svelte-localization-with-svelte-i18n-v3/
 */

type LocaleDictionary = (typeof dictionary extends Writable<infer U> ? U : never)[string]

function verifySupportedLocale(locale: string): string {
    return locale in SUPPORTED_LOCALES ? locale : DEFAULT_LOCALE_OPTIONS.fallbackLocale
}

function reduceLocale(locale: string): string {
    return locale.replace('_', '-').split('-')[0]
}

function hasLoadedLocale(locale: string): boolean {
    return locale in get(dictionary)
}

function loadJson(url: string): Promise<LocaleDictionary> {
    return fetch(url).then((response) => response.json())
}

async function loadLocaleMessages(locale: string): Promise<void> {
    const messagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', locale)
    const localeDictionary = await loadJson(messagesFileUrl)

    addMessages(locale, localeDictionary)
}

const MESSAGE_FILE_URL_TEMPLATE = 'locales/{locale}.json'

/**
 * Initializes and loads the appropriate i18n dictionary given
 * specific locale options.
 */
export async function setupI18n(options: LocaleOptions = { fallbackLocale: 'en', initialLocale: null }): Promise<void> {
    // Attempt to auto-detect user's locale if not explicitly given
    const locale = verifySupportedLocale(options.initialLocale || reduceLocale(getLocaleFromNavigator() || 'en'))

    init({ ...DEFAULT_LOCALE_OPTIONS, initialLocale: locale } as Parameters<typeof init>[0])

    if (!hasLoadedLocale(locale)) {
        await loadLocaleMessages(locale)

        appSettings.set({
            ...get(appSettings),
            language: locale,
        })

        // Load English locale dictionary as fallback for unsupported translations
        if (locale !== 'en' && !hasLoadedLocale('en')) {
            await loadLocaleMessages('en')
        }
    }
}

/**
 * Translates a given dictionary path into the appropriate locale.
 */
export const localize = get(_)

/**
 * Sets the locale dictionary to a given language, resetting the dictionary
 * if already initialized.
 */
export const setLanguage = (item: { value }): void => {
    const locale = Object.keys(SUPPORTED_LOCALES).find((key) => SUPPORTED_LOCALES[key] === item.value)
    appSettings.set({
        ...get(appSettings),
        language: locale,
    })

    void setupI18n({ fallbackLocale: 'en', initialLocale: locale })
}

/**
 * Formats a given date according to the current locale options.
 */
export const formatDate = (
    date: Date,
    options: Intl.DateTimeFormatOptions & {
        format?: string
        locale?: string
        dateStyle?: 'full' | 'long' | 'medium' | 'short'
        timeStyle?: 'full' | 'long' | 'medium' | 'short'
    }
): string => getDateFormatter({ locale: getLocaleFromNavigator(), ...options }).format(date)

// We expose the svelte-i18n _ store so that our app has a single API for i18n
export { _ }
