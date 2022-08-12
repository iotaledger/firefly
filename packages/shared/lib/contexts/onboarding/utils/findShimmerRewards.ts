import { get } from 'svelte/store'

import { api } from '@core/profile-manager'

import { prepareShimmerClaimingAccount } from '../helpers'
import { IShimmerClaimingAccount } from '../interfaces'
import { shimmerClaimingProfileManager } from '../stores'

let accountGapLimit = 1
let addressGapLimit = 10

export async function findShimmerRewards(): Promise<IShimmerClaimingAccount[]> {
    try {
        const _shimmerClaimingProfileManager = get(shimmerClaimingProfileManager)
        const accounts = await _shimmerClaimingProfileManager?.recoverAccounts(accountGapLimit, addressGapLimit)

        accountGapLimit += 1
        addressGapLimit += 1

        return Promise.all(
            accounts.map(async (account) => {
                const boundAccount = await api?.getAccount(_shimmerClaimingProfileManager?.id, account?.meta?.index)
                const balance = await boundAccount?.getBalance()
                return prepareShimmerClaimingAccount(boundAccount, balance)
            })
        )
    } catch (err) {
        console.error(err)
    }
}
