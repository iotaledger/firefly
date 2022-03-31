import { DashboardRoute } from '@core/router'
import { NotificationType } from 'shared/lib/typings/notification'

export type SidebarTab = {
    icon: string
    label: string
    route: DashboardRoute
    onClick: () => void
    notificationType?: NotificationType
}
