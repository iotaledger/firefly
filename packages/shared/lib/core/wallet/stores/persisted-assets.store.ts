import { activeProfile } from '@core/profile'
import { persistent } from '@lib/helpers'
import { get } from 'svelte/store'
import { IPersistedAsset } from '../interfaces'
import { IPersistedAssets } from '../interfaces/persisted-assets.interface'

export const persistedAssets = persistent<IPersistedAssets>('persistedAssets', {})

export function getPersistedAsset(tokenId: string): IPersistedAsset {
    return get(persistedAssets)?.[get(activeProfile)?.id]?.[tokenId]
}

export function addPersistedAsset( persistedAsset: IPersistedAsset): void {
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
    persistedAssets.update(state => {
        state[get(activeProfile).id] = {}
        return state
    })
}
