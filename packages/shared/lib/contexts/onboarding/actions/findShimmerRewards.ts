import { get } from 'svelte/store'

import { api } from '@core/profile-manager'

import { prepareShimmerClaimingAccount } from '../helpers'
import { shimmerClaimingProfileManager, updateOnboardingProfile } from '../stores'

let accountGapLimit = 1
let addressGapLimit = 10

export async function findShimmerRewards(): Promise<void> {
    try {
        const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
        const accounts = await _shimmerClaimingProfileManager?.recoverAccounts(accountGapLimit, addressGapLimit)

        // TODO: Add actual logic for cleverly increasing these numbers
        accountGapLimit += 1
        addressGapLimit += 1

        const shimmerClaimingAccounts = await Promise.all(
            accounts.map(async (account) => {
                const boundAccount = await api?.getAccount(_shimmerClaimingProfileManager?.id, account?.meta?.index)
                const balance = await boundAccount?.getBalance()
                return prepareShimmerClaimingAccount(boundAccount, balance)
            })
        )
        updateOnboardingProfile({ shimmerClaimingAccounts })
    } catch (err) {
        console.error(err)
    }
}
