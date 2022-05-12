/**
 * The interface for managing deep links.
 */
export interface IDeepLinkManager {
    checkDeepLinkRequestExists(): void
    clearDeepLinkRequest(): void
}
