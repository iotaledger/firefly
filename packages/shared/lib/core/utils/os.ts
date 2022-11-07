import { showAppNotification } from '@auxiliary/notification'
import { localize } from '@core/i18n'
import { Platform } from '@core/app'

export function sleep(ms: number): Promise<number> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function setClipboard(input: string, shouldNotify: boolean = true): boolean {
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

        if (shouldNotify) {
            showAppNotification({ type: 'info', message: localize('notifications.copiedToClipboard') })
        }

        return true
    } catch (err) {
        console.error(err)

        return false
    }
}

export function downloadRecoveryKit(): void {
    fetch('assets/docs/recovery-kit.pdf')
        .then((response) => response.arrayBuffer())
        .then((data) => {
            void Platform.saveRecoveryKit(data)
        })
        .catch((err) => {
            console.error(err)
        })
}
