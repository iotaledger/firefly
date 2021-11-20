import { openPopup } from './popup'
import { api } from './wallet'
import type { Event } from './typings/events'
import type { StrongholdStatus } from './typings/wallet'
import { showAppNotification } from './notifications'
import { localize } from './i18n'
import { isSoftwareProfile } from './profile'

// TODO: Use better function name later
export const checkStronghold = (callback: any): void => {
    if (!isSoftwareProfile) {
        showAppNotification({
            type: 'error',
            // TODO: Add to the locale later
            message: 'Ledger profiles do not have a Stronghold.',
        })
    }

    api.getStrongholdStatus({
        onSuccess(response: Event<StrongholdStatus>) {
            const isLocked = response.payload.snapshot.status === 'Locked'
            if (isLocked) {
                openPopup({
                    type: 'password',
                    props: {
                        onSuccess: callback
                    }
                }, true)
            } else {
                callback()
            }
        },
        onError(err) {
            showAppNotification({
                type: 'error',
                message: localize(err?.error),
            })
        }
    })
}
