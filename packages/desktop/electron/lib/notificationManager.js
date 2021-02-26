/**
 * Create and show a native notification
 * @param {string} message - the notification message
 */
function notify(message) {
    const notification = new Notification('Firefly', {
        body: message,
    })

    notification.onclick = () => {
        // TODO switch to the account
        console.log('notification clicked')
    }
}

module.exports = {
    notify,
}
