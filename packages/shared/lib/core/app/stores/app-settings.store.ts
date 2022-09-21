import { persistent } from '@lib/helpers'
import { writable } from 'svelte/store'
import { DEFAULT_APP_SETTINGS } from '../constants'
import { IAppSettings } from '../interfaces'

/**
 * The store containing the application settings used throughout the entire app.
 */
export const appSettings = persistent<IAppSettings>('settings', DEFAULT_APP_SETTINGS)

/**
 * The store containing the initial application settings from the beginning of the current
 * session.
 *
 * CAUTION: This variable is READ-ONLY - you write at your own risk.
 */
export const initAppSettings = writable<Readonly<Partial<IAppSettings>>>(DEFAULT_APP_SETTINGS)
