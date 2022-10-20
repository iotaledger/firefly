import { writable } from 'svelte/store'

import { DEFAULT_NOTIFICATION_TIMEOUT, NOTIFICATION_TIMEOUT_NEVER } from '../constants'
import { INotificationData } from '../interfaces'

export const notifications = writable<INotificationData[]>([])

export function removeDisplayNotification(id: string): void {
    notifications.update((_currentNotifications) => {
        const idx = _currentNotifications.findIndex((n) => n.id === id)
        if (idx >= 0) {
            _currentNotifications.splice(idx, 1)
        }
        return _currentNotifications
    })
}

export function updateDisplayNotificationProgress(id: string, progress: number): void {
    notifications.update((_currentNotifications) => {
        const notification = _currentNotifications.find((n) => n.id === id)
        if (notification) {
            notification.progress = Math.min(Math.max(progress, 0), 100)
        }
        return _currentNotifications
    })
}

export function updateDisplayNotification(id: string, updateData: INotificationData): void {
    notifications.update((_currentNotifications) => {
        const notification = _currentNotifications.find((n) => n.id === id)
        if (notification) {
            notification.message = updateData.message
            notification.subMessage = updateData.subMessage
            notification.progress = updateData.progress
            notification.actions = updateData.actions
            notification.timeout = updateData.timeout ?? DEFAULT_NOTIFICATION_TIMEOUT

            if (notification.timeout !== NOTIFICATION_TIMEOUT_NEVER) {
                setTimeout(() => removeDisplayNotification(notification.id), notification.timeout)
            }
        }
        return _currentNotifications
    })
}
