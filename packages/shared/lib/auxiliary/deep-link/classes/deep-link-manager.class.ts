import { IDeepLinkManager } from '@core/app/interfaces'

import { handleDeepLink as _handleDeepLink } from '../actions'

export class DeepLinkManager implements IDeepLinkManager {
    constructor() {}

    handleDeepLink(input: string): void {
        _handleDeepLink(input)
    }

    checkDeepLinkRequestExists(): void {
        throw new Error('This should be implemented in the main process.')
    }

    clearDeepLinkRequest(): void {
        throw new Error('This should be implemented in the main process.')
    }
}
