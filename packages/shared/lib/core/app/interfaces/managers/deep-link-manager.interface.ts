/**
 * The interface for managing deep links.
 */
export interface IDeepLinkManager {
    handleDeepLink(input: string): void

    checkDeepLinkRequestExists(): void
    clearDeepLinkRequest(): void
}
