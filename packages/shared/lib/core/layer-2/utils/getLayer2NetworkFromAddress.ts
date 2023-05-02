import { get } from 'svelte/store'
import { DEFAULT_CHAINS } from '@core/layer-2/constants'
import { activeProfile } from '@core/profile/stores'

export function getLayer2NetworkFromAddress(address: string): string {
    const networkId = get(activeProfile)?.network?.id
    const entry = Object.entries(DEFAULT_CHAINS[networkId]).find((defaultChain) => defaultChain[1] === address)
    return entry?.[0]
}
