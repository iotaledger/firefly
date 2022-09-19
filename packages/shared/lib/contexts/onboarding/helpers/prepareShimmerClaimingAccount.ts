import { get } from 'svelte/store'

import { Transaction } from '@iota/wallet'

import { IAccount, sumTotalFromOutputs, syncAccountsInParallel, syncAccountsInSeries } from '@core/account'
import { filterShimmerClaimingOutputs } from '@core/utils'

import { DEFAULT_SHIMMER_CLAIMING_SYNC_OPTIONS } from '../constants'
import { ShimmerClaimingAccountState } from '../enums'
import { IShimmerClaimingAccount } from '../interfaces'
import { isOnboardingLedgerProfile } from '../stores'

import { deriveShimmerClaimingAccountState } from './deriveShimmerClaimingAccountState'

export async function prepareShimmerClaimingAccount(
    account: IAccount,
    twinAccount?: IAccount,
    syncAccounts?: boolean,
    state?: ShimmerClaimingAccountState,
    claimingTransaction?: Transaction
): Promise<IShimmerClaimingAccount> {
    if (syncAccounts) {
        if (get(isOnboardingLedgerProfile)) {
            /**
             * CAUTION: To avoid possible freezes / hanging
             * on Ledger devices (due to simultaneously accessing
             * the device from multiple profile managers at once).
             */
            await syncAccountsInSeries(DEFAULT_SHIMMER_CLAIMING_SYNC_OPTIONS, account, twinAccount)
        } else {
            await syncAccountsInParallel(DEFAULT_SHIMMER_CLAIMING_SYNC_OPTIONS, account, twinAccount)
        }
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
        ...(claimingTransaction && { claimingTransaction }),
    }
}
