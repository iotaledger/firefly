import { persistent } from './helpers'

/**
 * The types of themes for the app
 */
export type AppTheme = 'light' | 'dark' | 'system'

/**
 * App Settings
 */
export interface AppSettings {
    deepLinking: boolean
    language: string,
    theme: AppTheme,
    darkMode: boolean,
    notifications: boolean
}

export const appSettings = persistent<AppSettings>('settings', {
    deepLinking: false,
    language: 'en',
    theme: 'light',
    darkMode: false,
    notifications: true
})

/**
 * NOTE: This media query is performed only once to help make the UX
 * consistent across OS platforms. To be specific, it ensures that users
 * are required to restart Firefly for system theme changes to take effect.
 * This is because the behaviour of this media query is different among platforms,
 * e.g. MacOS allows for Firefly to update the app theme without the restart whereas
 * Linux-based platforms do require the app restart.
 */
const _shouldBeDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

/**
 * Determines if the theme is dark or not based on the current
 * application settings
 * @param theme the theme to check against
 * @returns true if the app should be in dark mode according to the theme
 */
export const shouldBeDarkMode = (theme: AppTheme): boolean => {
    return theme === 'system' ? _shouldBeDarkMode : theme === 'dark'
}
