import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
import { localize } from '@core/i18n'
import { Platform } from '../classes/platform.class'
import { externalAllowedLinks } from '../constants'
import { showAppNotification } from '@auxiliary/notification'

export function openUrlInBrowser(targetUrl: string): void {
    // If no protocol is specified, assume https
    if (!targetUrl.includes('://')) {
        targetUrl = 'https://' + targetUrl
    }
    // If the protocol is http, replace it with https
    targetUrl = targetUrl.replace(/^http:/, 'https:')

    const url = new URL(targetUrl)
    const domain = url.hostname.replace(/^www\./, '')
    const isAllowed = externalAllowedLinks.includes(domain) || externalAllowedLinks.includes(domain + url.pathname)

    if (isAllowed) {
        openHttpsUrlsOnly(url.protocol, targetUrl)
    } else {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('popups.externalUrl.title'),
                description: localize('popups.externalUrl.body', { values: { url: targetUrl } }),
                hint: localize('popups.externalUrl.hint'),
                warning: true,
                confirmText: localize('popups.externalUrl.action'),
                onConfirm: () => {
                    openHttpsUrlsOnly(url.protocol, targetUrl)
                    closePopup()
                },
            },
        })
    }
}

function openHttpsUrlsOnly(protocol: string, targetUrl: string): void {
    if (protocol === 'https:') {
        Platform.openUrl(targetUrl)
    } else {
        showAppNotification({
            alert: true,
            type: 'error',
            message: localize('popups.externalUrl.invalidProtocol'),
        })
    }
}
