import { IAppUpdateDownloadProgress, IAppVersionDetails } from '@core/app/interfaces'
import { DashboardRoute } from '@core/router/enums'

export interface EventMap {
    'menu-logout': void
    'menu-navigate-wallet': DashboardRoute
    'menu-navigate-settings': void
    'menu-check-for-update': void
    'menu-error-log': void
    'menu-diagnostics': void
    'menu-create-developer-profile': void
    'menu-create-normal-profile': void
    'log-error': void
    'deep-link-request': void
    'deep-link-params': string
    'version-details': IAppVersionDetails
    'version-progress': IAppUpdateDownloadProgress
    'version-complete': void
    'version-error': Error
    'notification-activated': unknown
}

export interface Event<T> {
    action: string
    id: string
    type: unknown
    payload: T
}
