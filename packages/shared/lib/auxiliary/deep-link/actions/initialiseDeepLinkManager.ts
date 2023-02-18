import { Platform } from '@core/app/classes'

import { handleDeepLink } from './handleDeepLink'

export function initialiseDeepLinkManager(): void {
    const { DeepLinkManager } = Platform
    /**
     * CAUTION: We can only override methods whose implementations
     * are NOT in the main process.
     */
    Platform.DeepLinkManager = {
        ...DeepLinkManager,
        handleDeepLink,
    }
}
