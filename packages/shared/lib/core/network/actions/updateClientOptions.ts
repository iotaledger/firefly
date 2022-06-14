import { getNodeCandidates, IClientOptions } from '@core/network'
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
    if (!builtClientOptions.node) {
        return
    }

    // const hasMismatchedNetwork = clientOptions.node?.network?.id !== clientOptions.network
    // if (hasMismatchedNetwork && isNewNotification('warning')) {
    //     showAppNotification({
    //         type: 'error',
    //         message: localize('error.network.badNodes'),
    //     })

    //     return
    // }

    setClientOptions(clientOptions)
}

function buildClientOptions(clientOptions: Partial<IClientOptions>): IClientOptions {
    const nodes = getNodeCandidates(clientOptions).map((n) => ({ ...n, network: clientOptions.network }))
    return {
        ...clientOptions,
        nodes,
        network: clientOptions.network,
    }
}
