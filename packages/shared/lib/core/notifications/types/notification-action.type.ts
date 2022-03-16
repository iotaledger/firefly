import { NotificationData } from '@core/notifications/types'

export type NotificationAction = {
    label: string
    isPrimary?: boolean
    callback?: (notificationData: NotificationData, actionIndex: number) => void
}
