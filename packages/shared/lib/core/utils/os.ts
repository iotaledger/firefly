import { localize } from '@core/i18n'
import { showAppNotification } from '@core/notifications'
import { Platform } from '@core/platform'

/**
 * Downloads the mnemonic phrase recovery kit.
 */
export const downloadRecoveryKit = (): void => {
    fetch('assets/docs/recovery-kit.pdf')
        .then((response) => response.arrayBuffer())
        .then((data) => {
            void Platform.saveRecoveryKit(data)
        })
        .catch((err) => {
            console.error(err)
        })
}

/**
 * Copies text to the system clipboard.
 */
export const setClipboard = (input: string): boolean => {
    try {
        const textArea = document.createElement('textarea')
        textArea.value = input
        document.body.appendChild(textArea)

        if (/ipad|iphone/i.exec(navigator.userAgent)) {
            const range = document.createRange()
            range.selectNodeContents(textArea)
            const selection = window.getSelection()
            selection.removeAllRanges()
            selection.addRange(range)
            textArea.setSelectionRange(0, 999999)
        } else {
            textArea.select()
        }

        document.execCommand('copy')
        document.body.removeChild(textArea)

        const notificationMessage = localize('notifications.copiedToClipboard')
        showAppNotification({ type: 'info', message: notificationMessage })

        return true
    } catch (err) {
        console.error(err)

        return false
    }
}
