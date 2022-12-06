import { closePopup, openPopup } from '@auxiliary/popup'
import { localize } from '@core/i18n'
import { Platform } from '../classes/platform.class'
import { externalAllowedLinks } from '../constants'

export function openUrlInBrowser(targetUrl: string): void {
    const url = new URL(targetUrl)
    const domain = url.hostname.replace('www.', '').replace('mailto:', '')

    if (externalAllowedLinks.includes(domain) || externalAllowedLinks.includes(domain + url.pathname)) {
        Platform.openUrl(targetUrl)
    } else {
        openPopup({
            type: 'confirmation',
            props: {
                title: localize('popups.externalUrl.title'),
                description: localize('popups.externalUrl.body', { values: { targetUrl } }),
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
