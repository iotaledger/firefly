import { get } from 'svelte/store'

import { NetworkHealth } from '../enums'
import { IChainStatus } from '../interfaces'
import { chainStatuses, network } from '../stores'

export async function updateChainStatuses(): Promise<void> {
    const chains = get(network)?.getChains() ?? []
    /**
     * CAUTION: It may become problematic when a profile contains
     * many chains such that the poll interval is not long enough
     * to complete all the queries for every chain's status.
     */
    await Promise.all(
        chains.map(async (chain) => {
            let chainStatus: IChainStatus
            try {
                await chain.getLatestBlock()
                chainStatus = { health: NetworkHealth.Operational }
            } catch (err) {
                chainStatus = { health: NetworkHealth.Disconnected }
            }

            const chainId = chain.getConfiguration().chainId
            chainStatuses.update((_chainStatuses) => ({ ..._chainStatuses, [chainId]: chainStatus }))
        })
    )
}
