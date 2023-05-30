import { get } from 'svelte/store'

import { activeProfile } from '@core/profile/stores'
import { persistent } from '@core/utils/store'

import { NotVerifiedStatus, VerifiedStatus } from '../enums'
import { IPersistedAsset, IPersistedAssets } from '../interfaces'

export const persistedAssets = persistent<IPersistedAssets>('persistedAssets', {})

export function getPersistedAsset(tokenId: string): IPersistedAsset {
    return get(persistedAssets)?.[get(activeProfile)?.id]?.[tokenId]
}

export function addPersistedAsset(...newPersistedAssets: IPersistedAsset[]): void {
    persistedAssets.update((state) => {
        if (!state[get(activeProfile).id]) {
            state[get(activeProfile).id] = {}
        }
        for (const asset of newPersistedAssets) {
            state[get(activeProfile).id][asset.id] = asset
        }
        return state
    })
}

export function clearPersistedAssetForActiveProfile(): void {
    persistedAssets.update((state) => {
        state[get(activeProfile).id] = {}
        return state
    })
}

export function updatePersistedAsset(partialPersistedAsset: Partial<IPersistedAsset>): void {
    const asssetId = partialPersistedAsset?.id
    if (asssetId) {
        persistedAssets.update((state) => {
            state[get(activeProfile).id][asssetId] = {
                ...state[get(activeProfile).id][asssetId],
                ...partialPersistedAsset,
            }
            return state
        })
    }
}

export function verifyAsset(assetId: string, status: VerifiedStatus): void {
    updatePersistedAsset({ id: assetId, verification: { verified: true, status } })
}

export function unverifyAsset(assetId: string, status: NotVerifiedStatus): void {
    updatePersistedAsset({ id: assetId, verification: { verified: false, status } })
}

export function hideAsset(assetId: string): void {
    updatePersistedAsset({ id: assetId, hidden: true })
}

export function unhideAsset(assetId: string): void {
    updatePersistedAsset({ id: assetId, hidden: false })
}
