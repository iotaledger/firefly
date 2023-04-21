import { selectedAccount } from '@core/account/stores'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { networkStatus } from '../stores'
import { ConnectedChain } from '../interfaces'

export function buildChainFromNetwork(): ConnectedChain {
    return {
        name: get(activeProfile).network.name,
        address: get(selectedAccount).depositAddress,
        status: get(networkStatus).health,
    }
}
