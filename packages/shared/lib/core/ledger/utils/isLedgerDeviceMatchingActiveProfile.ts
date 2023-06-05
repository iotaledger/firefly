import { get } from 'svelte/store'

import { selectedAccount } from '@core/account/stores'
import { profileManager } from '@core/profile-manager/stores'

import { LedgerAppName } from '../enums'
import { isLedgerAppOpen } from './isLedgerAppOpen'

export async function isLedgerDeviceMatchingActiveProfile(): Promise<boolean | undefined> {
    if (isLedgerAppOpen(LedgerAppName.Shimmer)) {
        try {
            const account = get(selectedAccount)
            if (!account) {
                return undefined
            }

            const cachedAddress = account?.depositAddress
            const generatedAddress = await get(profileManager)?.generateAddress(account.index, 0, {
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
