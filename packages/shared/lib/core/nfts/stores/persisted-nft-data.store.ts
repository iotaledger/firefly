import { derived, get, Readable } from 'svelte/store'

import { activeProfile } from '@core/profile/stores'
import { persistent } from '@core/utils/store'
import { IPersistedNftData, IPersistedNftStore } from '../interfaces'

export const persistedNfts = persistent<IPersistedNftStore>('persistedNfts', {})

export const persistedNftForActiveProfile: Readable<{ [nftId: string]: IPersistedNftData }> = derived(
    [persistedNfts, activeProfile],
    ([$persistedNfts, $activeProfile]) => $persistedNfts[$activeProfile?.id]
)

export function addPersistedNftData(nftId: string, newPersistedNft: IPersistedNftData): void {
    persistedNfts.update((state) => {
        if (!state[get(activeProfile)?.id]) {
            state[get(activeProfile)?.id] = {}
        }
        state[get(activeProfile)?.id][nftId] = newPersistedNft
        return state
    })
}
