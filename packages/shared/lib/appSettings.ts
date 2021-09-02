import { persistent } from './helpers'
import type { AppSettings } from './typings/app'

export const appSettings = persistent<AppSettings>('settings', {
    developerMode: false,
    deepLinking: false,
    language: 'en',
    darkMode: false,
    notifications: true,
})
