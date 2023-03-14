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
import { IIrc27Metadata, INft } from '../interfaces'
import { parseNftMetadata } from './parseNftMetadata'
import { rewriteIpfsUri } from './rewriteIpfsUri'

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
    const composedUrl = composeUrlFromNftMetadata(parsedMetadata)
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
        filePath,
        downloadMetadata: {
            error: undefined,
            warning: undefined,
            isLoaded: false,
        },
    }
}

function composeUrlFromNftMetadata(metadata: IIrc27Metadata): string {
    const targetUrl = metadata?.uri
    if (!targetUrl) {
        return undefined
    }

    const url = new URL(targetUrl)
    let newUrl

    switch (url.protocol) {
        case 'http:':
            newUrl = targetUrl.replace('http:', 'https:')
            break
        case 'https:':
            newUrl = targetUrl
            break
        case 'ipfs:':
            newUrl = rewriteIpfsUri(targetUrl)
            break
        default:
            return undefined
    }

    newUrl = newUrl.replace(/\/+$/, '')
    return newUrl
}
