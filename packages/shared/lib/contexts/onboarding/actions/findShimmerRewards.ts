import { get } from 'svelte/store'

import { api, profileManager } from '@core/profile-manager'

import { prepareShimmerClaimingAccount } from '../helpers'
import { shimmerClaimingProfileManager, updateOnboardingProfile } from '../stores'

let accountGapLimit = 1
let addressGapLimit = 10

export async function findShimmerRewards(): Promise<void> {
    try {
        const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
        const accounts = await _shimmerClaimingProfileManager?.recoverAccounts(accountGapLimit, addressGapLimit)

        accountGapLimit += 1
        addressGapLimit += 1

        const shimmerClaimingAccounts = await Promise.all(
            accounts.map(async (account) => {
                const boundShimmerClaimingAccount = await api?.getAccount(
                    _shimmerClaimingProfileManager?.id,
                    account?.meta?.index
                )
                const boundRegularAccount = await api?.getAccount(get(profileManager)?.id, account?.meta?.index)
                if (boundShimmerClaimingAccount?.meta?.index !== boundRegularAccount?.meta?.index) {
                    return
                }

                return prepareShimmerClaimingAccount(boundShimmerClaimingAccount, boundRegularAccount, true)
            })
        )
        updateOnboardingProfile({ shimmerClaimingAccounts })
    } catch (err) {
        console.error(err)
    }
}
