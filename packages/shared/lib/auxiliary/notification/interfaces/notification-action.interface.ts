import { NotificationCallback } from '../types'

export interface INotificationAction {
    label: string
    isPrimary?: boolean
    callback?: NotificationCallback
}
