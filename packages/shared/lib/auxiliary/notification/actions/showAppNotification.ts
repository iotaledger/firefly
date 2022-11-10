import { INotificationData } from '../interfaces'

import { showNotification } from './showNotification'

export function showAppNotification(notificationData: INotificationData): string {
    return showNotification(notificationData, false)
}
