import { AppTheme } from '../enums'

/**
 * The application settings, used across multiple profiles.
 */
export interface IAppSettings {
    deepLinking: boolean
    language: string
    theme: AppTheme
    darkMode: boolean
    notifications: boolean
    sendCrashReports: boolean
}
