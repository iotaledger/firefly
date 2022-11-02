import { IAccountState } from '@core/account'
import { activeAccounts } from '@core/profile'
import { get } from 'svelte/store'
import { OUTPUT_TYPE_NFT } from '../../wallet/constants'
import { INft } from '../interfaces'
import { buildNftFromNftOutput, getIsOwnedFromUnspentNftOutput } from '../utils'
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
            const isOwned = getIsOwnedFromUnspentNftOutput(account.depositAddress, outputData.output)
            const nft = buildNftFromNftOutput(outputData.output, outputData.outputId, isOwned)
            accountNfts.push(nft)
        }
    }
    setAccountNftsInAllAccountNfts(account.index, accountNfts)
}
