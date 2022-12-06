import { closePopup, openPopup } from '@auxiliary/popup'
import { localize } from '@core/i18n'
import { Platform } from '../classes/platform.class'
import { externalAllowedLinks } from '../constants'

export function openUrlInBrowser(url: string): void {
    if (externalAllowedLinks.some((allowedLink) => url.includes(allowedLink))) {
        Platform.openUrl(url)
    } else {
        openPopup({
            type: 'confirmation',
            props: {
                title: localize('popups.externalUrl.title'),
                description: localize('popups.externalUrl.body', { values: { url } }),
                hint: localize('popups.externalUrl.hint'),
                warning: true,
                confirmText: localize('popups.externalUrl.action'),
                onConfirm: () => {
                    Platform.openUrl(url)
                    closePopup()
                },
            },
        })
    }
}
