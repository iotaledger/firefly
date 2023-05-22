import { get } from 'svelte/store'

import { activeProfile } from '@core/profile'
import { persistent } from '@core/utils/store'
import { IPersistedEvmAddresses } from '../interfaces'

export const persistedEvmAddresses = persistent<IPersistedEvmAddresses>('persistedEvmAddresses', {})

export function getPersistedEvmAddress(accountIndex: number): string | undefined {
    return get(persistedEvmAddresses)[get(activeProfile)?.id]?.[accountIndex]
}

export function addPersistedEvmAddress(evmAddress: string | undefined, accountIndex: number): void {
    persistedEvmAddresses.update((state) => {
        if (!state[get(activeProfile)?.id]) {
            state[get(activeProfile)?.id] = []
        }
        state[get(activeProfile)?.id][accountIndex] = evmAddress
        return state
    })
}
