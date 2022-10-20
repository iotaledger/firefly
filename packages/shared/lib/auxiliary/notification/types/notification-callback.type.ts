import { INotificationData } from '../interfaces'

export type NotificationCallback = (data: INotificationData, actionIndex: number) => void
