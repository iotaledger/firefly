import { Transaction } from '@iota/wallet'

import { IAccount, sumTotalFromOutputs, syncAccountsInParallel } from '@core/account'
import { filterShimmerClaimingOutputs } from '@core/utils'

import { DEFAULT_SHIMMER_CLAIMING_SYNC_OPTIONS } from '../constants'
import { ShimmerClaimingAccountState } from '../enums'
import { IShimmerClaimingAccount } from '../interfaces'

import { deriveShimmerClaimingAccountState } from './deriveShimmerClaimingAccountState'

export async function prepareShimmerClaimingAccount(
    account: IAccount,
    twinAccount?: IAccount,
    syncAccounts?: boolean,
    state?: ShimmerClaimingAccountState,
    claimingTransaction?: Transaction
): Promise<IShimmerClaimingAccount> {
    if (syncAccounts) {
        await syncAccountsInParallel(DEFAULT_SHIMMER_CLAIMING_SYNC_OPTIONS, account, twinAccount)
    }

    const twinUnspentOutputs = await twinAccount?.listUnspentOutputs()
    const claimedRewards = sumTotalFromOutputs(twinUnspentOutputs)

    /**
     * NOTE: We filter only the basic outputs with one unlock condition to ensure
     * that asynchronous transactions aren't considered (extremely unlikely edge case).
     */
    const unspentOutputs = (await account?.listUnspentOutputs()).filter(filterShimmerClaimingOutputs)
    const unclaimedRewards = sumTotalFromOutputs(unspentOutputs)

    state = state ?? deriveShimmerClaimingAccountState(claimedRewards, unclaimedRewards)

    return {
        ...account,
        ...(twinAccount && { twinAccount }),
        state,
        claimedRewards,
        unclaimedRewards,
        claimingTransaction,
    }
}
