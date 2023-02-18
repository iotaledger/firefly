import { get } from 'svelte/store'

import { showAppNotification } from '@auxiliary/notification'
import { localize } from '@core/i18n'
import { activeProfile } from '@core/profile/stores'

export function showDeepLinkNotification(): void {
    if (!get(activeProfile)?.loggedIn) {
        showAppNotification({
            type: 'info',
            message: localize('notifications.deepLinkingRequest.receivedWhileLoggedOut'),
        })
    }
}
