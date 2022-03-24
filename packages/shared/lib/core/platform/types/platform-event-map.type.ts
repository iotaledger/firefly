import { WalletRoutes } from '@lib/typings/routes'
import { NativeProgress, VersionDetails } from '@core/app'

export type PlatformEventMap = {
    'menu-logout': void
    'menu-navigate-wallet': WalletRoutes
    'menu-navigate-settings': void
    'menu-check-for-update': void
    'menu-error-log': void
    'menu-diagnostics': void
    'log-error': void
    'deep-link-request': void
    'deep-link-params': string
    'version-details': VersionDetails
    'version-progress': NativeProgress
    'version-complete': void
    'version-error': Error
    'notification-activated': unknown
}
