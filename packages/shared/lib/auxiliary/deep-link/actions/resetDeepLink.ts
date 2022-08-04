import { Platform } from '@lib/platform'

import { isDeepLinkRequestActive } from '../stores'

export function resetDeepLink(): void {
    Platform.DeepLinkManager.clearDeepLinkRequest()
    isDeepLinkRequestActive.set(false)
}
