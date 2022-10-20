import { get } from 'svelte/store'

import { INotificationData } from '../interfaces'
import { notifications } from '../stores'
import { NotificationType } from '../types'

export function isNewNotification(type: NotificationType): boolean {
    return get(notifications).filter((data: INotificationData) => data.type === type).length === 0
}
