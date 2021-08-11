import { persistent } from './helpers'
/**
 * App Settings
 */
export interface AppSettings {
    deepLinking: boolean
    language: string,
    darkMode: boolean,
    notifications: boolean
}

export const appSettings = persistent<AppSettings>('settings', {
    deepLinking: false,
    language: 'en',
    darkMode: false,
    notifications: true
})
