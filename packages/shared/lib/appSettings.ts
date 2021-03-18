import { persistent } from './helpers'
/**
 * App Settings
 */
export interface AppSettings {
    deepLinking: boolean
    language: string,
    developerMode: boolean,
    darkMode: boolean,
    notifications: boolean
}

export const appSettings = persistent<AppSettings>('settings', {
    deepLinking: false,
    language: 'en',
    developerMode: false,
    darkMode: false,
    notifications: true
})

