import { writable } from 'svelte/store'
import { persistent } from './helpers'
import type { AppSettings, AppTheme } from './typings/app'

/**
 * The application settings used throughout the application code, useful for
 * global settings beyond individual profile settings.
 */
export const appSettings = persistent<AppSettings>('settings', {
    deepLinking: false,
    language: 'en',
    theme: 'light',
    darkMode: false,
    notifications: true,
    sendDiagnostics: true,
})

/**
 * The initial application settings, useful for things that require
 * Firefly to restart\*:
 * - Sentry diagnostic reporting for errors and crashes - the Electron
 *    app and Rust bindings both need to know if sendDiagnostics is true
 *    when creating the actor system.
 *
 * \* The reason is that whenever the normal appSettings changes against this
 * object, we can determine if the user has restarted the application or not and
 * more importantly notify them if they need to do so.
 *
 * CAUTION: This variable is READ-ONLY - you write at your own risk.
 */
export const initAppSettings = writable<Readonly<Partial<AppSettings>>>(null)

/**
 * NOTE: This media query is performed only once to help make the UX
 * consistent across OS platforms. To be specific, it ensures that users
 * are required to restart Firefly for system theme changes to take effect.
 * This is because the behaviour of this media query is different among platforms,
 * e.g. queries on MacOS result in up-to-date information whereas Linux-based platforms
 * result in stale information.
 */
const isSystemInDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

/**
 * Determines if the theme is dark or not based on the current
 * application settings
 *
 * @param {AppTheme} theme The theme to check against
 *
 * @returns {boolean} True if the app should be in dark mode according to the theme
 */
export const shouldBeDarkMode = (theme: AppTheme): boolean =>
    theme === 'system' ? isSystemInDarkMode : theme === 'dark'
