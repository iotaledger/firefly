import { IAppUpdateDownloadProgress } from './app-update-download-progress.interface'
import { IAppVersionDetails } from './app-version-details.interface'
import { INFTDownloadState } from './nft-download-state.interface'

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
    'evm-address': string
}
