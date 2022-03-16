import { writable } from 'svelte/store'

import { NotificationData } from '@core/notifications'

export const displayNotifications = writable<NotificationData[]>([])
