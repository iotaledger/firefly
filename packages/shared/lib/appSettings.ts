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
 * Determines if the theme is dark or not based on the current
 * application settings
 */
export const shouldBeDarkMode = (theme: AppTheme): boolean => {
    if(theme === 'system')
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    else
        return theme === 'dark'
}
