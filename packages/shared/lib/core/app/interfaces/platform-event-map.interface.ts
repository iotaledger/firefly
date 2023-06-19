import { IAppUpdateDownloadProgress, IAppVersionDetails, IEvmAddress, INFTDownloadState, ISignedTransaction } from '.'

export interface IPlatformEventMap {
    'menu-logout': void
    'menu-navigate-wallet': void
    'menu-navigate-settings': void
    'menu-check-for-update': void
    'menu-error-log': void
    'menu-diagnostics': void
    'log-error': void
    'deep-link-request': void
    'deep-link-params': string
    'version-details': IAppVersionDetails
    'version-progress': IAppUpdateDownloadProgress
    'version-complete': void
    'version-error': Error
    'notification-activated': unknown
    'nft-download-done': INFTDownloadState
    'nft-download-interrupted': INFTDownloadState
    'evm-address': IEvmAddress
    'evm-signed-transaction': ISignedTransaction
    'ledger-error': Error
}
