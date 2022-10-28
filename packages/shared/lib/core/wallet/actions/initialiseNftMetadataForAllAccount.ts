import { activeAccounts } from '@core/profile'
import { INftOutput } from '@iota/types'
import { get } from 'svelte/store'
import { OUTPUT_TYPE_NFT } from '../constants'
import { IStoredNft } from '../interfaces'
import { setAccountNftsInAllAccountNfts } from '../stores'
import { getMetadataFromNftOutput, getNftId } from '../utils'

export async function initialiseNftMetadataForAllAccount(): Promise<void> {
    const allAccounts = get(activeAccounts)

    for (const account of allAccounts) {
        const nftBalance: IStoredNft[] = []
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
                const nftMetadata = getMetadataFromNftOutput(nftOutput)
                nftMetadata.id = nftId
                nftBalance.push({
                    isUnspent: true,
                    nftMetadata,
                })
            }
        }

        setAccountNftsInAllAccountNfts(account.index, nftBalance)
    }
}
