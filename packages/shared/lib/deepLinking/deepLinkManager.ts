import type { IDeepLinkManager } from 'lib/typings/deepLinking/deepLinkManager'

/** Deep link manager  */
// Runs in renderer process
export const CapacitorDeepLinkManager: IDeepLinkManager = {
    checkDeepLinkRequestExists: () => {},
    clearDeepLinkRequest: () => {},
}
