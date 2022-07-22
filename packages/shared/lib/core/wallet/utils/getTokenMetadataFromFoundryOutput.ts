import { ITokenMetadata } from '../interfaces'
import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { IFoundryOutput } from '@iota/types'
import { Converter } from '@lib/converter'

export async function getTokenMetadataFromFoundryOutput(tokenId: string): Promise<ITokenMetadata> {
    const foundry = await get(selectedAccount).getFoundryOutput(tokenId)
    const data = getHexDataFromFoundryOutput(foundry)
    const metadata = JSON.parse(Converter.hexToUtf8(data))

    const isValid = validateNativeTokenMetadata(metadata)
    return isValid
        ? {
              name: metadata.name,
              tickerSymbol: metadata.symbol,
              unit: metadata.symbol,
              decimals: metadata.decimals,
              useMetricPrefix: false,
          }
        : undefined
}

function getHexDataFromFoundryOutput(foundry: IFoundryOutput): string {
    if (foundry?.immutableFeatures?.length > 0) {
        for (const feature of foundry?.immutableFeatures) {
            if (feature.type === 2) {
                return feature.data
            }
        }
    }
    if (foundry?.features?.length > 0) {
        for (const feature of foundry?.features) {
            if (feature.type === 2) {
                return feature.data
            }
        }
    }
    return undefined
}

// TODO: add JSON Schema validation
// this is blocked because we cannot load .json files into our env. AJV requires this to be able to validate

// function validateNativeTokenMetadata(metadata): boolean {
//     const ajv = new Ajv()
//     const validate = ajv.compile(nativeTokenSchema)

//     return !!validate(metadata)
// }

function validateNativeTokenMetadata(metadata): boolean {
    if (!metadata.standard || typeof metadata.standard !== 'string') {
        return false
    }
    if (!metadata.name || typeof metadata.name !== 'string') {
        return false
    }
    if (!metadata.symbol || typeof metadata.symbol !== 'string') {
        return false
    }
    if ((!metadata.decimals && metadata.decimals !== 0) || typeof metadata.decimals !== 'number') {
        return false
    }

    if (metadata.description && typeof metadata.description !== 'string') {
        return false
    }
    if (metadata.logo && typeof metadata.logo !== 'string') {
        return false
    }
    if (metadata.logoUrl && typeof metadata.logoUrl !== 'string') {
        return false
    }
    return true
}
