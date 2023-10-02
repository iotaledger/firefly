import { ipcRenderer } from 'electron'

/**
 * Create and show a native notification
 * @param {string} message - the notification message
 * @param {any} metadata - data to associate with the notification
 */
export default {
    notify(message, contextData) {
        // APP_NAME is replaced by Webpack
        // eslint-disable-next-line no-undef
        const notification = new Notification(APP_NAME, {
            body: message,
            data: contextData,
        })

        notification.onclick = (event) => {
            ipcRenderer.send('notification-activated', event.target.data)
        }
    },
}
