import { closePopup, openPopup } from '@auxiliary/popup'
import { localize } from '@core/i18n'
import { Platform } from '../classes/platform.class'
import { externalAllowedLinks } from '../constants'
import { showAppNotification } from '@auxiliary/notification'

export function openUrlInBrowser(targetUrl: string): void {
    const url = new URL(targetUrl)
    const domain = url.hostname.replace(/^www\./, '')

    const isAllowed = externalAllowedLinks.includes(domain) || externalAllowedLinks.includes(domain + url.pathname)

    if (url.protocol !== 'https:') {
        showAppNotification({
            alert: true,
            type: 'error',
            message: localize('popups.externalUrl.invalidProtocol'),
        })
    } else if (isAllowed) {
        Platform.openUrl(targetUrl)
    } else {
        openPopup({
            type: 'confirmation',
            props: {
                title: localize('popups.externalUrl.title'),
                description: localize('popups.externalUrl.body', { values: { url: targetUrl } }),
                hint: localize('popups.externalUrl.hint'),
                warning: true,
                confirmText: localize('popups.externalUrl.action'),
                onConfirm: () => {
                    Platform.openUrl(targetUrl)
                    closePopup()
                },
            },
        })
    }
}
