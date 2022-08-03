export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export type NotificationAction = {
    label: string
    isPrimary?: boolean
    callback?: (notificationData: NotificationData, actionIndex: number) => void
}

export type NotificationData = {
    type: NotificationType
    message: string
    progress?: number
    subMessage?: string
    actions?: NotificationAction[]
    id?: string
    ts?: number
    timeout?: number
    contextData?: unknown
    alert?: boolean
}
