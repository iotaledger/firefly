import { get } from 'svelte/store'

import { openPopup } from '@core/popup'
import { api } from '@core/api'
import { BridgeEvent } from '@core/actor'
import { StrongholdStatus } from './typings/wallet'
import { showAppNotification } from '@core/notification'
import { localize } from '@core/i18n'
import { isLedgerProfile } from './profile'

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const checkStronghold = (callback: any): void => {
    if (get(isLedgerProfile)) {
        showAppNotification({
            type: 'error',
            message: localize('error.ledger.noStronghold'),
        })

        return
    }

    api.getStrongholdStatus({
        onSuccess(response: BridgeEvent<StrongholdStatus>) {
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
