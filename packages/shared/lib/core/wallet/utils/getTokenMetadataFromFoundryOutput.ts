import { IIrc30Metadata, IPersistedAsset } from '../interfaces'
import { selectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { IFoundryOutput } from '@iota/types'
import { Converter } from '@lib/converter'
import { addPersistedAsset, getPersistedAsset } from '../stores/persisted-assets.store'

export function getAssetFromPersistedAssets(tokenId: string): IPersistedAsset {
    const persistedAsset = getPersistedAsset(tokenId)
    if (persistedAsset) {
        return persistedAsset
    } else {
        return undefined
    }
}

export async function tryGetAndStoreAssetFromPersistedAssets(tokenId: string): Promise<IPersistedAsset> {
    const persistedAsset = getPersistedAsset(tokenId)
    if (persistedAsset) {
        return persistedAsset
    } else {
        return requestAndStorePersistedAsset(tokenId)
    }
}

export async function requestAndStorePersistedAsset(tokenId: string): Promise<IPersistedAsset> {
    const tokenMetadata = await getTokenMetadataFromFoundryOutput(tokenId)
    if (tokenMetadata) {
        const persistedAsset: IPersistedAsset = buildPersistedAssetFromIrc30Metadata(tokenId, tokenMetadata)
        addPersistedAsset(persistedAsset)
        return persistedAsset
    } else {
        return undefined
    }
}

async function getTokenMetadataFromFoundryOutput(tokenId: string): Promise<IIrc30Metadata> {
    const foundry = await get(selectedAccount).getFoundryOutput(tokenId)
    const data = getHexDataFromFoundryOutput(foundry)
    if (data) {
        const metadata = JSON.parse(Converter.hexToUtf8(data))
        const isValid = validateNativeTokenMetadata(metadata)
        if (isValid) {
            return metadata
        } else {
            return undefined
        }
    } else {
        return undefined
    }
}

function buildPersistedAssetFromIrc30Metadata(tokenId: string, metadata: IIrc30Metadata): IPersistedAsset {
    return {
        id: tokenId,
        metadata: {
            name: metadata.name,
            unit: metadata.symbol,
            decimals: metadata.decimals,
            useMetricPrefix: false,
            ...(metadata?.description && { description: metadata?.description }),
            ...(metadata?.url && { description: metadata?.url }),
            ...(metadata?.logoUrl && { description: metadata?.logoUrl }),
            ...(metadata?.logo && { description: metadata?.logo }),
        },
        hidden: false,
    }
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
