import { SpentOutputWalletEvent, WalletEvent, WalletEventType } from '@iota/sdk/out/types'

import { getNftByIdFromAllWalletNfts, updateNftInAllWalletNfts } from '@core/nfts'
import {
    syncBalance,
    ActivityAsyncStatus,
    ActivityType,
    validateWalletApiEvent,
    updateAsyncDataByTransactionId,
    allWalletActivities,
    WalletApiEventHandler,
} from '@core/wallet'
import { get } from 'svelte/store'
import { activeWallets, updateActiveWallet } from '@core/profile'

export function handleSpentOutputEvent(walletId: string): WalletApiEventHandler {
    return async (error: Error, rawEvent: WalletEvent) => {
        validateWalletApiEvent(error, rawEvent, WalletEventType.SpentOutput)
        if (rawEvent.type === WalletEventType.SpentOutput) {
            await handleSpentOutputEventInternal(walletId, rawEvent as SpentOutputWalletEvent)
        }
    }
}

export async function handleSpentOutputEventInternal(walletId: string, payload: SpentOutputWalletEvent): Promise<void> {
    const wallet = get(activeWallets)?.find((wallet) => wallet.id === walletId)
    const output = payload.output
    await syncBalance(walletId)
    if (wallet) {
        const walletOutputs = await wallet.outputs()
        updateActiveWallet(walletId, { walletOutputs })
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
        const previousOutputId = getNftByIdFromAllWalletNfts(walletId, activity.nftId)?.latestOutputId
        const previousOutput = await wallet.getOutput(previousOutputId)
        if (output.metadata.milestoneTimestampBooked > previousOutput.metadata.milestoneTimestampBooked) {
            updateNftInAllWalletNfts(walletId, activity.nftId, { isSpendable: false })
        }
    }
}
