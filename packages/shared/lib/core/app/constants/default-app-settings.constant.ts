import { AppTheme } from '../enums'
import { IAppSettings } from '../interfaces'

export const DEFAULT_APP_SETTINGS: IAppSettings = {
    deepLinking: false,
    language: 'en',
    theme: AppTheme.Light,
    darkMode: false,
    notifications: true,
    sendCrashReports: true,
}
