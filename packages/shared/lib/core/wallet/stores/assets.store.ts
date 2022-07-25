import { IAsset } from '@core/wallet'
import { get, writable, Writable } from 'svelte/store'
import { IAssetState } from '../interfaces/assets-state.interface'

export const assets: Writable<IAssetState[]> = writable([])

export function addBaseCoinAndNativeTokens(baseCoin: IAsset, nativeTokens: IAsset[], accountId: string): void {
    assets.update((state) => {
        state[accountId] = {
            baseCoin,
            nativeTokens,
        }
        return state
    })
}

export function setBaseCoinAsset(baseCoin: IAsset, accountId: string): void {
    assets.update((state) => {
        state[accountId] = {
            ...state[accountId],
            baseCoin,
        }
        return state
    })
}

export function updateBaseCoinAsset(partialBaseCoin: Partial<IAsset>, accountId: string): void {
    assets.update((state) => {
        state[accountId] = {
            ...state[accountId],
            baseCoin: { ...state[accountId]?.baseCoin, ...partialBaseCoin },
        }
        return state
    })
}

export function addNativeTokenAsset(nativeToken: IAsset, accountId: string): void {
    assets.update((state) => {
        const nativeTokens = state[accountId]?.nativeTokens ?? []
        nativeTokens.push(nativeToken)

        state[accountId] = {
            ...state[accountId],
            nativeTokens: [...nativeTokens],
        }
        return state
    })
}

export function updateNativeTokenAsset(partialNativeToken: Partial<IAsset>, accountId: string): void {
    assets.update((state) => {
        const updatedTokens = state[accountId].nativeTokens.map((nativeToken) =>
            partialNativeToken.id === nativeToken?.id ? { ...partialNativeToken, ...nativeToken } : nativeToken
        )

        state[accountId] = {
            ...state[accountId],
            nativeTokens: updatedTokens,
        }
        return state
    })
}

export function clearNativeTokenAssets(accountId: string): void {
    assets.update((state) => {
        state[accountId] = {
            ...state[accountId],
            nativeTokens: [],
        }
        return state
    })
}

export function getNativeTokenAssetById(id: string, accountId: string): IAsset {
    return get(assets)[accountId]?.nativeTokens?.find((asset) => asset.id === id)
}

export function getBaseCoin(accountId: string): IAsset {
    return get(assets)[accountId]?.baseCoin
}
