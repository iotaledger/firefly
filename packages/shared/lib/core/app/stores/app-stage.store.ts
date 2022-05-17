import { writable } from 'svelte/types/runtime/store'

import { AppStage } from '../enums'

/**
 * The store indicating the particular release environment of the app,
 * i.e. "alpha", "beta", or "prod".
 */
export const appStage = writable<AppStage>(AppStage.ALPHA)
