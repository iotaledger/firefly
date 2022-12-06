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
                title: localize('popups.deleteProfile.title'),
                hint: localize('popups.deleteProfile.confirmation'),
                warning: true,
                confirmText: localize('actions.delete'),
                onConfirm: () => {
                    Platform.openUrl(url)
                    closePopup()
                },
            },
        })
    }
}
