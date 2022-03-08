import { IDeepLinkManager } from 'shared/lib/typings/deepLinking/deepLinkManager'

/** Deep link manager  */
// Runs in renderer process
export const DeepLinkManager: IDeepLinkManager = {
    checkDeepLinkRequestExists: () => {},
    clearDeepLinkRequest: () => {},
}
