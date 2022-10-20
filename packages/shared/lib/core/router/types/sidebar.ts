import { DashboardRoute } from '@core/router'
import { NotificationType } from '@auxiliary/notification'

export type SidebarTab = {
    icon: string
    label: string
    route: DashboardRoute
    onClick: () => void
    notificationType?: NotificationType
}
