import { get } from 'svelte/store'

import { openPopup } from './popup'
import { api } from './wallet'
import type { Event } from './typings/events'
import type { StrongholdStatus } from './typings/wallet'
import { showAppNotification } from './notifications'
import { localize } from './i18n'
import { isLedgerProfile } from './profile'

export const checkStronghold = (callback: () => void): void => {
    if (get(isLedgerProfile)) {
        showAppNotification({
            type: 'error',
            message: localize('error.ledger.noStronghold'),
        })

        return
    }

    api.getStrongholdStatus({
        onSuccess(response: Event<StrongholdStatus>) {
            const isLocked = response.payload.snapshot.status === 'Locked'
            if (isLocked) {
                openPopup(
                    {
                        type: 'password',
                        props: {
                            onSuccess: callback,
                        },
                    },
                    true
                )
            } else {
                callback()
            }
        },
        onError(err) {
            showAppNotification({
                type: 'error',
                message: localize(err?.error),
            })
        },
    })
}
