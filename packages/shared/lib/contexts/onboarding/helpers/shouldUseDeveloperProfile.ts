import { get } from 'svelte/store'

import { AppStage, appStage } from '@core/app'

export function shouldUseDeveloperProfile(): boolean {
    return get(appStage) !== AppStage.PROD
}
