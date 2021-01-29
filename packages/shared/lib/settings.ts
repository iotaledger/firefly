import { persistent } from 'shared/lib/helpers'

/**
 * Deep links enabled setting
 */
export const deepLinking = persistent<boolean>('deepLinking', false)

/**
 * Deep links enabled setting
 */
export const developerMode = persistent<boolean>('developerMode', false)

/**
 * Deep links enabled setting
 */
export const outsourcePow = persistent<boolean>('outsourcePow', false)