import { IAccountState } from '@core/account/interfaces'
import { activeAccounts } from '@core/profile/stores'
import { getNftId } from '@core/wallet/utils'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { get } from 'svelte/store'
import { INft } from '../interfaces'
import { buildNftFromNftOutput } from '../utils'
import { setAccountNftsInAllAccountNfts } from './setAccountNftsInAllAccountNfts'
import { NftOutput, OutputType } from '@iota/sdk/out/types'

export async function loadNftsForActiveProfile(): Promise<void> {
    const allAccounts = get(activeAccounts)
    for (const account of allAccounts) {
        await loadNftsForAccount(account)
    }
}

async function loadNftsForAccount(account: IAccountState): Promise<void> {
    const accountNfts: INft[] = []
    const unspentOutputs = await account.unspentOutputs()
    for (const outputData of unspentOutputs) {
        if (outputData.output.type === OutputType.Nft) {
            const nft = buildNftFromNftOutput(outputData as IWrappedOutput, account.depositAddress)
            accountNfts.push(nft)
        }
    }

    const allOutputs = await account.outputs()
    const sortedNftOutputs = allOutputs
        .filter((output) => output.output.type === OutputType.Nft)
        .sort((a, b) => b.metadata.milestoneTimestampBooked - a.metadata.milestoneTimestampBooked)
    for (const outputData of sortedNftOutputs) {
        if (outputData.output.type === OutputType.Nft) {
            const nftOutput = outputData.output as NftOutput
            const nftId = getNftId(nftOutput.nftId, outputData.outputId)
            if (!accountNfts.some((nft) => nft.id === nftId)) {
                const nft = buildNftFromNftOutput(outputData as IWrappedOutput, account.depositAddress, false)
                accountNfts.push(nft)
            }
        }
    }
    setAccountNftsInAllAccountNfts(account.index, accountNfts)
}
