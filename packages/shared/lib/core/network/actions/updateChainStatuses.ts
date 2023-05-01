import { get } from 'svelte/store'

import { chainStatuses, network } from '../stores'
import { NetworkHealth } from '../enums'
import { IChainStatus } from '../interfaces'

export async function updateChainStatuses(): Promise<void> {
    const chains = get(network)?.getChains() ?? []
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
