/**
 * The types of themes for the app
 */
export type AppTheme = 'light' | 'dark' | 'system'

/**
 * Type definition for application settings
 */
export interface AppSettings {
    deepLinking: boolean
    language: string
    theme: AppTheme
    darkMode: boolean
    notifications: boolean
}
