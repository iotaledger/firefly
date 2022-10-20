import { NotificationType } from '../types'

import { INotificationAction } from './notification-action.interface'

export interface INotificationData {
    type: NotificationType
    message: string
    progress?: number
    subMessage?: string
    actions?: INotificationAction[]
    id?: string
    ts?: number
    timeout?: number
    contextData?: unknown
    alert?: boolean
}
