import { IAsset } from '@core/wallet'
import { get, writable, Writable } from 'svelte/store'
import { IAssetState } from '../interfaces/assets-state.interface'

export const assets: Writable<IAssetState> = writable({
    baseCoin: undefined,
    nativeTokens: [],
})

export function setBaseCoin(baseCoin: IAsset): void {
    assets.update((state) => ({
        ...state,
        baseCoin,
    }))
}

export function updateBaseCoin(partialBaseCoin: Partial<IAsset>): void {
    assets.update((state) => ({
        ...state,
        baseCoin: { ...state?.baseCoin, ...partialBaseCoin },
    }))
}

export function addNativeToken(nativeToken: IAsset): void {
    assets.update((state) => ({
        ...state,
        nativeTokens: [...state.nativeTokens, nativeToken],
    }))
}

export function updateNativeToken(partialNativeToken: Partial<IAsset>): void {
    assets.update((state) => ({
        ...state,
        nativeTokens: state.nativeTokens.map((nativeToken) =>
            partialNativeToken.id === nativeToken?.id ? { ...partialNativeToken, ...nativeToken } : nativeToken
        ),
    }))
}

export function clearNativeTokens(): void {
    assets.update((state) => ({
        ...state,
        nativeTokens: [],
    }))
}

export function getNativeTokenById(id: string): IAsset {
    return get(assets).nativeTokens.find((asset) => asset.id === id)
}
