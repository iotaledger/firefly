import { persistent } from '@core/utils/storage'

import { AppSettings } from '../types'
import { writable } from 'svelte/store'

/**
 * The application settings used throughout the application code, useful for
 * global settings beyond individual profile settings.
 */
export const appSettings = persistent<AppSettings>('settings', {
    deepLinking: false,
    language: 'en',
    theme: 'light',
    darkMode: false,
    notifications: true,
    sendCrashReports: false,
})

/**
 * The initial application settings, useful for things that require
 * Firefly to restart\*:
 * - Sentry diagnostic reporting for errors and crashes - the Electron
 *    app and Rust bindings both need to know if sendCrashReports is true
 *    when creating the actor system.
 *
 * \* The reason is that whenever the normal appSettings changes against this
 * object, we can determine if the user has restarted the application or not and
 * more importantly notify them if they need to do so.
 *
 * CAUTION: This variable is READ-ONLY - you write at your own risk.
 */
export const initAppSettings = writable<Readonly<Partial<AppSettings>>>(null)
