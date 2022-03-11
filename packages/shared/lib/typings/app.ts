export type AppTheme = 'light' | 'dark' | 'system'

export interface AppSettings {
    deepLinking: boolean
    language: string
    theme: AppTheme
    darkMode: boolean
    notifications: boolean
    sendCrashReports: boolean
}
