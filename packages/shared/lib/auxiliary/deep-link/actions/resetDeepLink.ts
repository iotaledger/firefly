import { Platform } from '@core/app'

export function resetDeepLink(): void {
    Platform.DeepLinkManager.clearDeepLinkRequest()
}
