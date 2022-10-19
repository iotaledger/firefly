import { INotificationData } from '../interfaces'

import { showNotification } from './showNotification'

export function showSystemNotification(notificationData: INotificationData): string {
    return showNotification(notificationData, true)
}
