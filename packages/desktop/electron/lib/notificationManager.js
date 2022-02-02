const { ipcRenderer } = require('electron')

/**
 * Create and show a native notification
 * @param {string} message - the notification message
 * @param {any} metadata - data to associate with the notification
 */
const NotificationManager = {
    notify(message, contextData) {
        const notification = new Notification('Firefly', {
            body: message,
            data: contextData,
        })

        notification.onclick = (event) => {
            ipcRenderer.send('notification-activated', event.target.data)
        }
    },
}

module.exports = NotificationManager
