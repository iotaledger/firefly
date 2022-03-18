import { NotificationData } from './notification-data.type'

export type NotificationAction = {
    label: string
    isPrimary?: boolean
    callback?: (notificationData: NotificationData, actionIndex: number) => void
}
