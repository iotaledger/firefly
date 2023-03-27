import { derived, get, Readable } from 'svelte/store'

import { activeProfile } from '@core/profile'
import { persistent } from '@core/utils/store'
import { IPersistedNftData, IPersistedNftStore } from '../interfaces'

export const persistedNfts = persistent<IPersistedNftStore>('persistedNfts', {})

export const persistedNftForActiveProfile: Readable<{ [nftId: string]: IPersistedNftData }> = derived(
    [persistedNfts],
    ($persistedNfts) => $persistedNfts[get(activeProfile)?.id]
)

export function addPersistedNftData(nftId: string, newPersistedNft: IPersistedNftData, accountIndex: number): void {
    persistedNfts.update((state) => {
        if (!state[accountIndex]) {
            state[accountIndex] = {}
        }
        state[accountIndex][nftId] = newPersistedNft
        return state
    })
}
