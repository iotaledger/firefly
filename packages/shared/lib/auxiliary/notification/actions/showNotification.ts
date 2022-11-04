import { get } from 'svelte/store'

import { appSettings, Platform } from '@core/app'
import { generateRandomId } from '@core/utils'

import { DEFAULT_NOTIFICATION_TIMEOUT, NOTIFICATION_TIMEOUT_NEVER } from '../constants'
import { INotificationData } from '../interfaces'
import { notifications, removeDisplayNotification } from '../stores'

export function showNotification(notificationData: INotificationData, showSystemNotification: boolean): string {
    notificationData.id = generateRandomId()
    notificationData.ts = Date.now()
    notificationData.actions = notificationData.actions ?? []
    notificationData.timeout = notificationData.timeout ?? DEFAULT_NOTIFICATION_TIMEOUT
    if (notificationData.progress !== undefined) {
        notificationData.progress = Math.min(Math.max(notificationData.progress, 0), 100)
    }

    if (showSystemNotification && get(appSettings).notifications && Platform.NotificationManager) {
        Platform.NotificationManager.notify(notificationData.message, notificationData.contextData)
    } else {
        for (const action of notificationData.actions) {
            if (!action.callback) {
                action.callback = (notificationData): void => removeDisplayNotification(notificationData.id)
            }
        }

        notifications.update((_currentNotifications) => {
            _currentNotifications.push(notificationData)
            return _currentNotifications
        })
    }

    if (notificationData.timeout !== NOTIFICATION_TIMEOUT_NEVER) {
        setTimeout(() => removeDisplayNotification(notificationData.id), notificationData.timeout)
    }

    return notificationData.id
}
