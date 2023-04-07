import { activeProfileId } from '@core/profile/stores/active-profile-id.store'
import {
    ADDRESS_TYPE_NFT,
    getBech32AddressFromAddressTypes,
    getIssuerFromNftOutput,
    getMetadataFromNftOutput,
    getNftId,
} from '@core/wallet'
import { INftOutput } from '@iota/types'
import { get } from 'svelte/store'
import { DEFAULT_NFT_NAME } from '../constants'
import { INft } from '../interfaces'
import { parseNftMetadata } from './parseNftMetadata'
import { composeUrlFromNftUri } from './composeUrlFromNftUri'

export function buildNftFromNftOutput(
    nftOutput: INftOutput,
    outputId: string,
    isSpendable: boolean,
    timelockTime?: string
): INft {
    const id = getNftId(nftOutput.nftId, outputId)
    const address = getBech32AddressFromAddressTypes({ type: ADDRESS_TYPE_NFT, nftId: id })
    const issuer = getIssuerFromNftOutput(nftOutput)
    const metadata = getMetadataFromNftOutput(nftOutput)
    const parsedMetadata = parseNftMetadata(metadata)
    const composedUrl = composeUrlFromNftUri(parsedMetadata?.uri)
    const filePath = `${get(activeProfileId)}/nfts/${id}`

    return {
        id,
        address,
        name: parsedMetadata?.name ?? DEFAULT_NFT_NAME,
        issuer,
        isSpendable,
        timelockTime: timelockTime ? Number(timelockTime) : undefined,
        metadata,
        parsedMetadata,
        latestOutputId: outputId,
        composedUrl,
        downloadUrl: composedUrl,
        filePath,
        downloadMetadata: {
            error: undefined,
            warning: undefined,
            isLoaded: false,
        },
    }
}
