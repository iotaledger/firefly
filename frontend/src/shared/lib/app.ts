import { persistent } from './helpers'

/**
 * Dark mode enabled state
 */
export const darkMode = persistent<boolean>('darkMode', false)