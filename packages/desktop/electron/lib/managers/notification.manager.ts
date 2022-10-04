import { ipcRenderer } from 'electron'

export const NotificationManager = {
    // Create and show a native notification
    notify(message: string, contextData: unknown): void {
        const notification = new Notification('Firefly', {
            body: message,
            data: contextData,
        })
        notification.onclick = (event: Event): void => {
            ipcRenderer.send('notification-activated', event?.target?.data)
        }
    },
}
