import { get } from 'svelte/store'

import {
    getOutputParameters,
    resetNewTokenTransactionDetails,
    setNewTransactionDetails,
    NewTransactionType,
    NewTokenTransactionDetails,
    SubjectType,
    getDepositAddress,
} from '@core/wallet'
import { logAndNotifyError } from '@core/error/actions'

import { ShimmerClaimingWalletState } from '../enums'
import { IShimmerClaimingWallet } from '../interfaces'
import {
    isOnboardingLedgerProfile,
    onboardingProfile,
    persistShimmerClaimingTransaction,
    updateShimmerClaimingAccount,
} from '../stores'
import { handleLedgerError } from '@core/ledger/utils'
import { SHIMMER_CLAIM_DEFAULT_TRANSACTION_OPTIONS } from '../constants'

// TODO(2.0) Fix this

export async function claimShimmerRewards(): Promise<void> {
    const shimmerClaimingAccounts = get(onboardingProfile)?.shimmerClaimingAccounts
    const unclaimedShimmerClaimingAccounts =
        shimmerClaimingAccounts?.filter((shimmerClaimingAccount) => shimmerClaimingAccount?.unclaimedRewards > 0) ?? []
    await claimShimmerRewardsForShimmerClaimingAccounts(unclaimedShimmerClaimingAccounts)
}

async function claimShimmerRewardsForShimmerClaimingAccounts(
    shimmerClaimingAccounts: IShimmerClaimingWallet[]
): Promise<void> {
    for (const shimmerClaimingAccount of shimmerClaimingAccounts) {
        try {
            updateShimmerClaimingAccount({
                ...shimmerClaimingAccount,
                state: ShimmerClaimingWalletState.Claiming,
            })
            await claimShimmerRewardsForShimmerClaimingAccount(shimmerClaimingAccount)
        } catch (err) {
            updateShimmerClaimingAccount({
                ...shimmerClaimingAccount,
                state: ShimmerClaimingWalletState.Failed,
            })
            if (get(isOnboardingLedgerProfile)) {
                handleLedgerError(err?.error ?? err)
            } else {
                logAndNotifyError({
                    type: 'error',
                    message: err,
                    localizationKey: 'notifications.claimShimmerRewards.error',
                    logToConsole: true,
                    saveToErrorLog: true,
                })
            }
        }
    }
}

async function claimShimmerRewardsForShimmerClaimingAccount(
    shimmerClaimingAccount: IShimmerClaimingWallet
): Promise<void> {
    const recipientAddress = await getDepositAddress(shimmerClaimingAccount?.twinAccount)
    const rawAmount = shimmerClaimingAccount?.unclaimedRewards

    const newTransactionDetails: NewTokenTransactionDetails = {
        recipient: {
            type: SubjectType.Address,
            address: recipientAddress,
        },
        type: NewTransactionType.TokenTransfer,
        rawAmount: rawAmount.toString(),
        unit: '',
    }
    setNewTransactionDetails(newTransactionDetails)

    const outputParams = await getOutputParameters(newTransactionDetails)
    const preparedOutput = await shimmerClaimingAccount?.prepareOutput(
        outputParams,
        SHIMMER_CLAIM_DEFAULT_TRANSACTION_OPTIONS
    )

    const claimingTransaction = await shimmerClaimingAccount?.sendOutputs([preparedOutput])
    resetNewTokenTransactionDetails()

    persistShimmerClaimingTransaction(claimingTransaction?.transactionId)

    const claimedRewards = shimmerClaimingAccount?.claimedRewards + rawAmount
    const unclaimedRewards = shimmerClaimingAccount?.unclaimedRewards - rawAmount
    updateShimmerClaimingAccount({
        ...shimmerClaimingAccount,
        /**
         * NOTE: We still explicitly set the state here to
         * display as "claiming" to user until it's updated
         * later by the transaction inclusion event handler.
         */
        state: ShimmerClaimingWalletState.Claiming,
        claimingTransaction,
        claimedRewards,
        unclaimedRewards,
    })
}
