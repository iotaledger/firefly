import { DashboardRoute } from '@core/router'
import { NotificationType } from '@auxiliary/notification'
import { Icon } from '@auxiliary/icon'

export interface ISidebarTab {
    icon: Icon
    label: string
    route: DashboardRoute
    onClick: () => void
    notificationType?: NotificationType
}
