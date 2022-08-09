import { getNodeCandidates, IClientOptions } from '@core/network'
import { updateActiveProfile } from '@core/profile'
import { setClientOptions } from '@core/profile-manager'

/**
 * Update the client options for a profile.
 *
 * @method updateClientOptions
 *
 * @param {Partial<IClientOptions>} clientOptions
 *
 * @returns {void}
 */

export function updateClientOptions(clientOptions: Partial<IClientOptions>): void {
    const builtClientOptions = buildClientOptions(clientOptions)
    if (builtClientOptions?.nodes || builtClientOptions?.primaryNode) {
        updateActiveProfile({ clientOptions })
        setClientOptions(clientOptions)
    } else {
        throw new Error('Error: Must have at least one node set in the client options')
    }
}

function buildClientOptions(clientOptions: Partial<IClientOptions>): IClientOptions {
    const nodes = getNodeCandidates(clientOptions).map((n) => ({ ...n, network: clientOptions.network }))
    return {
        ...clientOptions,
        nodes,
        network: clientOptions.network,
    }
}
