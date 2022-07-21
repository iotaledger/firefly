import { ITokenMetadata, nativeTokenSchema } from '../interfaces'
import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { IFoundryOutput } from '@iota/types'
import { Converter } from '@lib/converter'
import Ajv from 'ajv'

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

function validateNativeTokenMetadata(metadata): boolean {
    const ajv = new Ajv()
    const validate = ajv.compile(nativeTokenSchema)

    return !!validate(metadata)
}
