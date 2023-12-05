import { get } from 'svelte/store'

import { Transaction } from '@iota/sdk/out/types'

import { filterShimmerClaimingOutputs } from '@core/utils'

import { SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS } from '../constants'
import { ShimmerClaimingWalletState } from '../enums'
import { IShimmerClaimingWallet } from '../interfaces'
import { isOnboardingLedgerProfile } from '../stores'

import { deriveShimmerClaimingWalletState } from './deriveShimmerClaimingWalletState'
import { IWallet } from '@core/profile'
import { syncWalletsInSeries, syncWalletsInParallel } from '@core/wallet/utils'
import { sumTotalFromOutputs } from '@core/wallet'

// TODO(2.0) Fix code

export async function prepareShimmerClaimingAccount(
    wallet: IWallet,
    twinWallet?: IWallet,
    syncAccounts?: boolean,
    state?: ShimmerClaimingWalletState,
    claimingTransaction?: Transaction
): Promise<IShimmerClaimingWallet> {
    if (syncAccounts) {
        if (get(isOnboardingLedgerProfile)) {
            /**
             * CAUTION: To avoid possible freezes / hanging
             * on Ledger devices (due to simultaneously accessing
             * the device from multiple profile managers at once),
             * we sync the accounts in series.
             */
            await syncWalletsInSeries(SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS, wallet, twinWallet)
        } else {
            await syncWalletsInParallel(SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS, wallet, twinWallet)
        }
    }

    const twinUnspentOutputs = await twinWallet?.unspentOutputs()
    const claimedRewards = sumTotalFromOutputs(twinUnspentOutputs)

    /**
     * NOTE: We filter only the basic outputs with one unlock condition to ensure
     * that asynchronous transactions aren't considered (extremely unlikely edge case).
     */
    const unspentOutputs = (await account?.unspentOutputs())?.filter(filterShimmerClaimingOutputs)
    const unclaimedRewards = sumTotalFromOutputs(unspentOutputs)

    state = state ?? deriveShimmerClaimingWalletState(claimedRewards, unclaimedRewards)

    return {
        ...account,
        ...(twinAccount && { twinAccount }),
        state,
        claimedRewards,
        unclaimedRewards,
        ...(claimingTransaction && { claimingTransaction }),
    }
}
