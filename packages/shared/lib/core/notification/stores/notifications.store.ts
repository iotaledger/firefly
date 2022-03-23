import { writable } from 'svelte/store'

import { NotificationData } from '../types'

export const displayNotifications = writable<NotificationData[]>([])
