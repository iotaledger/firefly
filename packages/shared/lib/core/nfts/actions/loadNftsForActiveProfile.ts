import { IWalletState } from '@core/wallet/interfaces'
import { activeWallets } from '@core/profile/stores'
import { getNftId } from '@core/wallet/utils'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { get } from 'svelte/store'
import { INft } from '../interfaces'
import { buildNftFromNftOutput } from '../utils'
import { NftOutput, OutputData, OutputType } from '@iota/sdk/out/types'
import { setWalletNftsInAllWalletNfts } from './setWalletNftsInAllWalletNfts'
import { getUnixTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from '@core/network'

function sortNfts(outputA: OutputData, outputB: OutputData): number {
    const nodeProtocolParameters = get(nodeInfoProtocolParameters)
    if (!nodeProtocolParameters) return 0
    const unixTimestampA = getUnixTimestampFromNodeInfoAndSlotIndex(
        nodeProtocolParameters,
        outputA.metadata.included.slot
    )
    const unixTimestampB = getUnixTimestampFromNodeInfoAndSlotIndex(
        nodeProtocolParameters,
        outputB.metadata.included.slot
    )
    return unixTimestampB - unixTimestampA
}

export async function loadNftsForActiveProfile(): Promise<void> {
    const allWallets = get(activeWallets)
    for (const wallet of allWallets) {
        await loadNftsForWallet(wallet)
    }
}

async function loadNftsForWallet(wallet: IWalletState): Promise<void> {
    const walletNfts: INft[] = []
    const unspentOutputs = await wallet.unspentOutputs()
    for (const outputData of unspentOutputs) {
        if (outputData.output.type === OutputType.Nft) {
            const nft = buildNftFromNftOutput(outputData as IWrappedOutput, wallet.depositAddress)
            walletNfts.push(nft)
        }
    }

    const allOutputs = await wallet.outputs()
    const sortedNftOutputs = allOutputs.filter((output) => output.output.type === OutputType.Nft).sort(sortNfts)
    for (const outputData of sortedNftOutputs) {
        if (outputData.output.type === OutputType.Nft) {
            const nftOutput = outputData.output as NftOutput
            const nftId = getNftId(nftOutput.nftId, outputData.outputId)
            if (!walletNfts.some((nft) => nft.id === nftId)) {
                const nft = buildNftFromNftOutput(outputData as IWrappedOutput, wallet.depositAddress, false)
                walletNfts.push(nft)
            }
        }
    }
    setWalletNftsInAllWalletNfts(wallet.id, walletNfts)
}
