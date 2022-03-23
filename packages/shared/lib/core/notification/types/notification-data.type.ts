import { NotificationType } from './notification.type'
import { NotificationAction } from './notification-action.type'

export type NotificationData = {
    type: NotificationType
    message: string
    progress?: number
    subMessage?: string
    actions?: NotificationAction[]
    id?: string
    ts?: number
    timeout?: number
    contextData?: unknown
}
