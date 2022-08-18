import { get } from 'svelte/store'

import { AppStage, appStage } from '@core/app'

export function shouldBeDeveloperProfile(): boolean {
    return get(appStage) !== AppStage.PROD
}
