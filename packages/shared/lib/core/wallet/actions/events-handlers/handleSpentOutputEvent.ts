import { getNftByIdFromAllWalletNfts, updateNftInAllWalletNfts } from '@core/nfts'
import { activeWallets, updateActiveWallet } from '@core/profile'
import {
    ActivityAsyncStatus,
    ActivityType,
    WalletApiEventHandler,
    allWalletActivities,
    syncBalance,
    updateAsyncDataByTransactionId,
    validateWalletApiEvent,
} from '@core/wallet'
import { AccountOutput, OutputType, SpentOutputWalletEvent, WalletEvent, WalletEventType } from '@iota/sdk/out/types'
import { nodeInfoProtocolParameters } from 'shared/lib/core/network'
import { getUnixTimestampFromNodeInfoAndSlotIndex } from 'shared/lib/core/network/helpers/getSlotInfoFromNodeProtocolParameters'
import { get } from 'svelte/store'

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
    await syncBalance(walletId, true)
    if (wallet) {
        const walletOutputs = await wallet.outputs()
        const accountOutputs = await wallet.accounts()
        const implicitAccountOutputs = await wallet.implicitAccounts()
        updateActiveWallet(walletId, { walletOutputs, accountOutputs, implicitAccountOutputs })
        if (
            wallet.mainAccountId &&
            !walletOutputs.find(
                (output) =>
                    output.output.type === OutputType.Account &&
                    (output as unknown as AccountOutput).accountId === wallet.mainAccountId
            )
        ) {
            updateActiveWallet(walletId, { mainAccountId: undefined, depositAddress: '' })
        }
    }
    const outputId = output?.outputId
    const activity = get(allWalletActivities)?.[walletId]?.find((_activity) => _activity.outputId === outputId)

    if (activity && activity.asyncData?.asyncStatus === ActivityAsyncStatus.Unclaimed) {
        const transactionId = output?.metadata?.included.transactionId
        updateAsyncDataByTransactionId(walletId, transactionId, {
            asyncStatus: ActivityAsyncStatus.Claimed,
        })
    }

    if (activity?.type === ActivityType.Nft) {
        const previousOutputId = getNftByIdFromAllWalletNfts(walletId, activity.nftId)?.latestOutputId
        const protocolParameters = get(nodeInfoProtocolParameters)
        if (!wallet || !previousOutputId || !protocolParameters) return
        const previousOutput = await wallet.getOutput(previousOutputId)
        const unixTimestampOutputMetadata = getUnixTimestampFromNodeInfoAndSlotIndex(
            protocolParameters,
            output.metadata.included.slot
        )
        const unixTimestampPreviousOutputMetadata = getUnixTimestampFromNodeInfoAndSlotIndex(
            protocolParameters,
            previousOutput.metadata.included.slot
        )
        if (unixTimestampOutputMetadata > unixTimestampPreviousOutputMetadata) {
            updateNftInAllWalletNfts(walletId, activity.nftId, { isSpendable: false })
        }
    }
}
