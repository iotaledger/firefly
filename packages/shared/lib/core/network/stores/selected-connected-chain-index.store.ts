import { activeProfile } from '@core/profile'
import { Readable, Writable, derived, writable } from 'svelte/store'
import { buildChainFromNetwork } from '../utils'
import { ConnectedChain } from '../interfaces'
import { NetworkHealth } from '../enums'

export const selectedConnectedChainIndex: Writable<number> = writable(undefined)

export const selectedConnectedChain: Readable<ConnectedChain> = derived(
    [activeProfile, selectedConnectedChainIndex],
    ([$activeProfile, $selectedConnectedChainIndex]) => {
        if ($selectedConnectedChainIndex === 0) {
            return buildChainFromNetwork()
        } else {
            const index = $selectedConnectedChainIndex - 1
            const chain = $activeProfile.network.chains[index]
            return {
                name: chain.name,
                address: chain.name, // TODO
                status: NetworkHealth.Operational, // TODO
            }
        }
    }
)
