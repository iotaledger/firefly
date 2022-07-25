import { IAsset } from '@core/wallet'
import { get, writable, Writable } from 'svelte/store'
import { IAssetState } from '../interfaces/assets-state.interface'

export const assets: Writable<IAssetState> = writable({
    baseCoin: undefined,
    nativeTokens: [],
})

export function setBaseCoinAsset(baseCoin: IAsset): void {
    assets.update((state) => ({
        ...state,
        baseCoin,
    }))
}

export function updateBaseCoinAsset(partialBaseCoin: Partial<IAsset>): void {
    assets.update((state) => ({
        ...state,
        baseCoin: { ...state?.baseCoin, ...partialBaseCoin },
    }))
}

export function addNativeTokenAsset(nativeToken: IAsset): void {
    assets.update((state) => ({
        ...state,
        nativeTokens: [...state.nativeTokens, nativeToken],
    }))
}

export function updateNativeTokenAsset(partialNativeToken: Partial<IAsset>): void {
    assets.update((state) => ({
        ...state,
        nativeTokens: state.nativeTokens.map((nativeToken) =>
            partialNativeToken.id === nativeToken?.id ? { ...partialNativeToken, ...nativeToken } : nativeToken
        ),
    }))
}

export function clearNativeTokenAssets(): void {
    assets.update((state) => ({
        ...state,
        nativeTokens: [],
    }))
}

export function getNativeTokenAssetById(id: string): IAsset {
    return get(assets).nativeTokens.find((asset) => asset.id === id)
}
