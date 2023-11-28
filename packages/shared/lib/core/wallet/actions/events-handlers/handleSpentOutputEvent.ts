// TODO(2.0) Fix all of events code, blocked by https://github.com/iotaledger/iota-sdk/issues/1708

import { Event, SpentOutputWalletEvent, WalletEventType } from '@iota/sdk/out/types'

import { syncBalance } from 'shared/lib/core/wallet/actions/syncBalance'
import { getNftByIdFromAllAccountNfts, updateNftInAllAccountNfts } from '@core/nfts'
import { ActivityAsyncStatus, ActivityType, validateWalletApiEvent } from '@core/wallet'
import { allAccountActivities, updateAsyncDataByTransactionId } from '@core/wallet/stores/all-account-activities.store'
import { get } from 'svelte/store'
import { activeWallets } from 'shared/lib/core/profile'

export async function handleSpentOutputEvent(error: Error, rawEvent: Event): Promise<void> {
    const { walletId, payload } = validateWalletApiEvent(error, rawEvent, WalletEventType.SpentOutput)
    const type = payload.type
    if (type === WalletEventType.SpentOutput) {
        await handleSpentOutputEventInternal(walletId, payload as SpentOutputWalletEvent)
    }
}

// TODO(2.0) Fix all usages
export async function handleSpentOutputEventInternal(
    walletId: string,
    payload: SpentOutputWalletEvent
): Promise<void> {
    const account = get(activeWallets)?.find((wallet) => wallet.id === walletId)
    const output = payload.output
    await syncBalance(walletId)
    if (account) {
        const addressesWithOutputs = await getAddressesWithOutputs(account)
        updateActiveAccount(account.index, { addressesWithOutputs })
    }
    const outputId = output?.outputId
    const activity = get(allAccountActivities)?.[accountIndex]?.find((_activity) => _activity.outputId === outputId)

    if (activity && activity.asyncData?.asyncStatus === ActivityAsyncStatus.Unclaimed) {
        const transactionId = output?.metadata?.transactionId
        updateAsyncDataByTransactionId(accountIndex, transactionId, {
            asyncStatus: ActivityAsyncStatus.Claimed,
        })
    }

    if (activity?.type === ActivityType.Nft) {
        const previousOutputId = getNftByIdFromAllAccountNfts(accountIndex, activity.nftId)?.latestOutputId
        const previousOutput = await account.getOutput(previousOutputId)
        if (output.metadata.milestoneTimestampBooked > previousOutput.metadata.milestoneTimestampBooked) {
            updateNftInAllAccountNfts(accountIndex, activity.nftId, { isSpendable: false })
        }
    }
}
