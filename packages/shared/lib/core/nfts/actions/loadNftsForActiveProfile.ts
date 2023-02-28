import { IAccountState } from '@core/account'
import { activeAccounts } from '@core/profile'
import { getNftId } from '@core/wallet'
import { get } from 'svelte/store'
import { OUTPUT_TYPE_NFT } from '../../wallet/constants'
import { INft } from '../interfaces'
import { buildNftFromNftOutput, getSpendableStatusFromUnspentNftOutput } from '../utils'
import { setAccountNftsInAllAccountNfts } from './setAccountNftsInAllAccountNfts'

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
        if (outputData.output.type === OUTPUT_TYPE_NFT) {
            const { isSpendable, timeLockTime } = getSpendableStatusFromUnspentNftOutput(
                account.depositAddress,
                outputData.output
            )
            const nft = buildNftFromNftOutput(outputData.output, outputData.outputId, isSpendable, timeLockTime)
            accountNfts.push(nft)
        }
    }
    const allOutputs = await account.outputs()
    for (const outputData of allOutputs) {
        if (outputData.output.type === OUTPUT_TYPE_NFT) {
            const nftId = getNftId(outputData.output.nftId, outputData.outputId)
            if (!accountNfts.some((nft) => nft.id === nftId)) {
                const nft = buildNftFromNftOutput(outputData.output, outputData.outputId, false)
                accountNfts.push(nft)
            }
        }
    }
    setAccountNftsInAllAccountNfts(account.index, accountNfts)
}
