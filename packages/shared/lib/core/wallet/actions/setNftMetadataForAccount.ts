import { activeAccounts } from '@core/profile'
import { INftOutput } from '@iota/types'
import { get } from 'svelte/store'
import { OUTPUT_TYPE_NFT } from '../constants'
import { INftMetadata } from '../interfaces'
import { setAccountNftsInAllAccountNfts } from '../stores'
import { getMetadataFromNftOutput, getNftId } from '../utils'

export async function setNftMetadataForAccount(accountIndex: number): Promise<void> {
    const account = get(activeAccounts)[accountIndex]

    const nftBalance: INftMetadata[] = []
    const nftIds = account?.balances?.nfts ?? []

    const unspentNftOutputs = (await account.unspentOutputs()).filter(
        (outputData) => outputData.output.type === OUTPUT_TYPE_NFT
    )

    for (const nftId of nftIds) {
        const nftOutput = unspentNftOutputs.find((outputData) => {
            const output = outputData.output as INftOutput
            const outputNftId = getNftId(output.nftId, outputData.outputId)
            return outputNftId === nftId
        })?.output as INftOutput

        if (nftOutput) {
            const metadata = getMetadataFromNftOutput(nftOutput)
            metadata.id = nftId
            nftBalance.push(metadata)
        }
    }

    setAccountNftsInAllAccountNfts(accountIndex, nftBalance)
}
