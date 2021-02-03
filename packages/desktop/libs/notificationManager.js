/**
 * Create and show a native notification
 * @param {string} accountName - target account name
 * @param {string} message - the notification message
 * @param {object} settings - wallet settings
 */
function notify (accountName, message, settings) {
    if (!settings.notifications || !settings.notifications.general) {
        return;
    }

    const notification = new Notification('Firefly', {
        body: message.replace('{{account}}', accountName)
    });

    notification.onclick = () => {
        // TODO switch to the account
        console.log('notification clicked')
    };
}

module.exports = {
  notify
}
