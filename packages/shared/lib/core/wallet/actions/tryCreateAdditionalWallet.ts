import { get } from 'svelte/store'

import { showAppNotification } from '@auxiliary/notification/actions'
import { registerProposalsFromNodes } from '@contexts/governance/actions'
import { Platform } from '@core/app/classes'
import { localize } from '@core/i18n'
import { displayNotificationForLedgerProfile } from '@core/ledger/actions'
import { isActiveLedgerProfile } from '@core/profile/stores'
import { createNewWallet } from './createNewWallet'
import { setSelectedWallet } from './setSelectedWallet'
import { IError } from '@core/error/interfaces'

export async function tryCreateAdditionalWallet(alias: string, color: string): Promise<void> {
    try {
        const wallet = await createNewWallet(alias, color)
        setSelectedWallet(wallet.id)

        if (Platform.isFeatureFlagEnabled('governance')) {
            void registerProposalsFromNodes([wallet])
        }

        return Promise.resolve()
    } catch (err) {
        const errorMessage = (err as IError)?.error || (err as string)
        if (err) {
            console.error(errorMessage)
            if (get(isActiveLedgerProfile)) {
                displayNotificationForLedgerProfile('error', true, false, err)
            } else {
                showAppNotification({
                    type: 'error',
                    message: localize(errorMessage) ?? errorMessage,
                })
            }
        }
        return Promise.reject({ error: errorMessage })
    }
}
