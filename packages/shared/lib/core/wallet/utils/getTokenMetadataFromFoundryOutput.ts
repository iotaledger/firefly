import { ITokenMetadata } from '../interfaces'
import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { IFoundryOutput } from '@iota/types'
import { Converter } from '@lib/converter'

export async function getTokenMetadataFromFoundryOutput(tokenId: string): Promise<ITokenMetadata> {
    const foundry = await get(selectedAccount).getFoundryOutput(tokenId)
    const data = getHexDataFromFoundryOutput(foundry)
    const metadata = JSON.parse(Converter.hexToUtf8(data))

    return {
        name: metadata.name,
        tickerSymbol: metadata.symbol,
        unit: metadata.symbol,
        decimals: metadata.decimals,
        useMetricPrefix: false,
    }
}

function getHexDataFromFoundryOutput(foundry: IFoundryOutput): string {
    for (const feature of foundry.immutableFeatures) {
        if (feature.type === 2) {
            return feature.data
        }
    }
    return undefined
}
