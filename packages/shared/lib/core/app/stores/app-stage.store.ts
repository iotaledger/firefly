import { writable } from 'svelte/store'

import { AppStage } from '../enums'

/**
 * Beta mode
 */
export const appStage = writable<AppStage>(AppStage.ALPHA)
