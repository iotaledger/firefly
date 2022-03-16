import { NotificationAction, NotificationType } from '@core/notifications/types'

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
