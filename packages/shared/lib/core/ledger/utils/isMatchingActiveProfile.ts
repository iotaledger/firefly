import { get } from 'svelte/store'

import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
import { profileManager } from '@core/profile-manager/stores'

import { LedgerAppName } from '../enums'
import { isLedgerAppOpen } from './isLedgerAppOpen'

export async function isMatchingActiveProfile(): Promise<boolean | undefined> {
    if (isLedgerAppOpen(LedgerAppName.Shimmer)) {
        try {
            const account = get(selectedAccount)
            const cachedAddress = account?.depositAddress

            const accountIndex = account?.index ?? get(selectedAccountIndex)
            const generatedAddress = await get(profileManager)?.generateAddress(accountIndex, 0, {
                internal: false,
                ledgerNanoPrompt: false,
            })

            return cachedAddress === generatedAddress
        } catch (err) {
            return undefined
        }
    } else {
        return undefined
    }
}
