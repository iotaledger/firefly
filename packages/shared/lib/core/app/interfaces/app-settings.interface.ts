import { AppTheme } from '../types'

/**
 * The application settings for Firefly.
 */
export interface IAppSettings {
    deepLinking: boolean
    language: string
    theme: AppTheme
    darkMode: boolean
    notifications: boolean
    sendCrashReports: boolean
}
