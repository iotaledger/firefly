// TODO(2.0) Fix all of events code, blocked by https://github.com/iotaledger/iota-sdk/issues/1708

import { Event, SpentOutputWalletEvent, WalletEventType } from '@iota/sdk/out/types'

import { getNftByIdFromAllAccountNfts, updateNftInAllAccountNfts } from '@core/nfts'
import { syncBalance, ActivityAsyncStatus, ActivityType, validateWalletApiEvent, updateAsyncDataByTransactionId, allWalletActivities} from '@core/wallet'
import { get } from 'svelte/store'
import { activeWallets, updateActiveWallet } from '@core/profile'

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
    const wallet = get(activeWallets)?.find((wallet) => wallet.id === walletId)
    const output = payload.output
    await syncBalance(walletId)
    if (wallet) {
        // TODO(2.0) Fix getAddressesWithOutputs is missing
        const addressesWithOutputs = await getAddressesWithOutputs(wallet)
        updateActiveWallet(walletId, { addressesWithOutputs })
    }
    const outputId = output?.outputId
    const activity = get(allWalletActivities)?.[walletId]?.find((_activity) => _activity.outputId === outputId)

    if (activity && activity.asyncData?.asyncStatus === ActivityAsyncStatus.Unclaimed) {
        const transactionId = output?.metadata?.transactionId
        updateAsyncDataByTransactionId(walletId, transactionId, {
            asyncStatus: ActivityAsyncStatus.Claimed,
        })
    }

    if (activity?.type === ActivityType.Nft) {
        const previousOutputId = getNftByIdFromAllAccountNfts(walletId, activity.nftId)?.latestOutputId
        const previousOutput = await wallet.getOutput(previousOutputId)
        if (output.metadata.milestoneTimestampBooked > previousOutput.metadata.milestoneTimestampBooked) {
            updateNftInAllAccountNfts(walletId, activity.nftId, { isSpendable: false })
        }
    }
}
