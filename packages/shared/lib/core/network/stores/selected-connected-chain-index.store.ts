import { Readable, Writable, derived, writable } from 'svelte/store'

import { activeProfile } from '@core/profile/stores'
import { selectedAccount } from '@core/account/stores'

import { buildChainFromNetwork } from '../utils'
import { IConnectedChain } from '../interfaces'
import { NetworkHealth } from '../enums'
import { networkStatus } from './network-status.store'

export const selectedConnectedChainIndex: Writable<number> = writable(undefined)

export const selectedConnectedChain: Readable<IConnectedChain> = derived(
    [activeProfile, selectedConnectedChainIndex, selectedAccount, networkStatus],
    ([$activeProfile, $selectedConnectedChainIndex, $selectedAccount, $networkStatus]) => {
        if ($selectedConnectedChainIndex === 0) {
            return buildChainFromNetwork(
                $activeProfile.network.name,
                $selectedAccount.depositAddress,
                $networkStatus.health
            )
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
