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
    IOutputMetadataResponseTemp,
} from '@core/wallet'
import { get } from 'svelte/store'
import { activeWallets, updateActiveWallet } from '@core/profile'
import { nodeInfoProtocolParameters } from 'shared/lib/core/network'
import { getTimestampFromNodeInfoAndSlotIndex } from 'shared/lib/core/network/helpers/getSlotInfoFromNodeProtocolParameters'

export function handleSpentOutputEvent(walletId: string): WalletApiEventHandler {
    return async (error: Error, rawEvent: WalletEvent) => {
        validateWalletApiEvent(error, rawEvent, WalletEventType.SpentOutput)
        if (rawEvent.type === WalletEventType.SpentOutput) {
            await handleSpentOutputEventInternal(walletId, rawEvent as SpentOutputWalletEvent)
        }
    }
}

// TODO(2.0) Fix all usages
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
        const protocolParameters = get(nodeInfoProtocolParameters)
        if (!wallet || !previousOutputId || !protocolParameters) return
        const previousOutput = await wallet.getOutput(previousOutputId)
        const timestampOutputMetadata = getTimestampFromNodeInfoAndSlotIndex(
            protocolParameters,
            (output.metadata as unknown as IOutputMetadataResponseTemp).included.slot
        )
        const timestampPreviousOutputMetadata = getTimestampFromNodeInfoAndSlotIndex(
            protocolParameters,
            (previousOutput.metadata as unknown as IOutputMetadataResponseTemp).included.slot
        )
        if (timestampOutputMetadata > timestampPreviousOutputMetadata) {
            updateNftInAllWalletNfts(walletId, activity.nftId, { isSpendable: false })
        }
    }
}
