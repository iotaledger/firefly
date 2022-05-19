import { AppTheme } from '../enums'

export interface AppSettings {
    deepLinking: boolean
    language: string
    theme: AppTheme
    darkMode: boolean
    notifications: boolean
    sendCrashReports: boolean
}
