import { getSelectedAccount } from '@core/account/stores'
import { getProfileManager } from '@core/profile-manager/stores'

import { LedgerAppName } from '../enums'
import { isLedgerAppOpen } from './isLedgerAppOpen'

export async function isLedgerDeviceMatchingActiveProfile(): Promise<boolean | undefined> {
    if (isLedgerAppOpen(LedgerAppName.Shimmer)) {
        try {
            const account = getSelectedAccount()
            if (!account) {
                return undefined
            }

            const cachedAddress = account?.depositAddress
            const generatedAddress = await getProfileManager()?.generateEd25519Address(account.index, 0, {
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
