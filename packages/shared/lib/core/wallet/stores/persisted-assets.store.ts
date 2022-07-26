import { activeProfile } from '@core/profile'
import { persistent } from '@lib/helpers'
import { get } from 'svelte/store'
import { VerificationStatus } from '../enums'
import { IPersistedAsset } from '../interfaces'
import { IPersistedAssets } from '../interfaces/persisted-assets.interface'

export const persistedAssets = persistent<IPersistedAssets>('persistedAssets', {})

export function getPersistedAsset(tokenId: string): IPersistedAsset {
    return get(persistedAssets)?.[get(activeProfile)?.id]?.[tokenId]
}

export function addPersistedAsset(persistedAsset: IPersistedAsset): void {
    persistedAssets.update((state) => {
        let persistedAssetsForProfile = state[get(activeProfile).id]
        if (!persistedAssetsForProfile) {
            persistedAssetsForProfile = {}
        }
        persistedAssetsForProfile[persistedAsset.id] = persistedAsset
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
            const persistedAssetsForProfile = state[get(activeProfile).id]
            persistedAssetsForProfile[partialPersistedAsset.id] = {
                ...persistedAssetsForProfile[partialPersistedAsset.id],
                ...partialPersistedAsset,
            }
            return state
        })
    }
}

export function verifyAsset(assetId: string): void {
    updatePersistedAsset({ id: assetId, verification: VerificationStatus.Verified })
}

export function unverifyAsset(assetId: string): void {
    updatePersistedAsset({ id: assetId, verification: VerificationStatus.NotVerified })
}

export function hideAsset(assetId: string): void {
    updatePersistedAsset({ id: assetId, hidden: true })
}

export function unhideAsset(assetId: string): void {
    updatePersistedAsset({ id: assetId, hidden: false })
}
