import { Platform } from '@core/app'

import { isDeepLinkRequestActive } from '../stores'

export function resetDeepLink(): void {
    Platform.DeepLinkManager.clearDeepLinkRequest()
    isDeepLinkRequestActive.set(false)
}
