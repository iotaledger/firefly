import { get } from 'svelte/store'

import { COIN_TYPE, NetworkProtocol } from '@core/network'
import {
    DEFAULT_TRANSACTION_OPTIONS,
    getOutputOptions,
    resetNewTokenTransactionDetails,
    setNewTransactionDetails,
    NewTransactionType,
    NewTokenTransactionDetails,
} from '@core/wallet'
import { logAndNotifyError } from '@core/error/actions'

import { ShimmerClaimingAccountState } from '../enums'
import { IShimmerClaimingAccount } from '../interfaces'
import {
    isOnboardingLedgerProfile,
    onboardingProfile,
    persistShimmerClaimingTransaction,
    updateShimmerClaimingAccount,
} from '../stores'
import { handleLedgerError } from '@core/ledger'
import { getDepositAddress } from '@core/account'

export async function claimShimmerRewards(): Promise<void> {
    const shimmerClaimingAccounts = get(onboardingProfile)?.shimmerClaimingAccounts
    const unclaimedShimmerClaimingAccounts =
        shimmerClaimingAccounts?.filter((shimmerClaimingAccount) => shimmerClaimingAccount?.unclaimedRewards > 0) ?? []
    await claimShimmerRewardsForShimmerClaimingAccounts(unclaimedShimmerClaimingAccounts)
}

async function claimShimmerRewardsForShimmerClaimingAccounts(
    shimmerClaimingAccounts: IShimmerClaimingAccount[]
): Promise<void> {
    for (const shimmerClaimingAccount of shimmerClaimingAccounts) {
        try {
            updateShimmerClaimingAccount({
                ...shimmerClaimingAccount,
                state: ShimmerClaimingAccountState.Claiming,
            })
            await claimShimmerRewardsForShimmerClaimingAccount(shimmerClaimingAccount)
        } catch (err) {
            updateShimmerClaimingAccount({
                ...shimmerClaimingAccount,
                state: ShimmerClaimingAccountState.Failed,
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
    shimmerClaimingAccount: IShimmerClaimingAccount
): Promise<void> {
    const rawAmount = shimmerClaimingAccount?.unclaimedRewards
    const recipientAddress = await getDepositAddress(shimmerClaimingAccount?.twinAccount)

    const newTransactionDetails: NewTokenTransactionDetails = {
        type: NewTransactionType.TokenTransfer,
        assetId: COIN_TYPE[NetworkProtocol.Shimmer].toString(),
        rawAmount: rawAmount.toString(),
        unit: '',
        recipient: {
            type: 'address',
            address: recipientAddress,
        },
    }
    setNewTransactionDetails(newTransactionDetails)

    const outputOptions = getOutputOptions(newTransactionDetails)
    const preparedOutput = await shimmerClaimingAccount?.prepareOutput(outputOptions, DEFAULT_TRANSACTION_OPTIONS)

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
        state: ShimmerClaimingAccountState.Claiming,
        claimingTransaction,
        claimedRewards,
        unclaimedRewards,
    })
}
