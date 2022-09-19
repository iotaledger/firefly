import { activeProfile } from '@core/profile'
import { persistent } from '@lib/helpers'
import { get } from 'svelte/store'
import { NotVerifiedStatus, VerifiedStatus } from '../enums'
import { IPersistedAsset } from '../interfaces'
import { IPersistedAssets } from '../interfaces/persisted-assets.interface'

export const persistedAssets = persistent<IPersistedAssets>('persistedAssets', {})

export function getPersistedAsset(tokenId: string): IPersistedAsset {
    return get(persistedAssets)?.[get(activeProfile)?.id]?.[tokenId]
}

export function addPersistedAsset(persistedAsset: IPersistedAsset): void {
    persistedAssets.update((state) => {
        if (!state[get(activeProfile).id]) {
            state[get(activeProfile).id] = {}
        }
        state[get(activeProfile).id][persistedAsset.id] = persistedAsset
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
    if (partialPersistedAsset?.id) {
        persistedAssets.update((state) => {
            state[get(activeProfile).id][partialPersistedAsset.id] = {
                ...state[get(activeProfile).id][partialPersistedAsset.id],
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
