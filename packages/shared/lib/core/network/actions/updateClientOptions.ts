import { getNodeCandidates, IClientOptions, INetworkConfig } from '@core/network'

/**
 * Update the client options for a profile.
 *
 * @method updateClientOptions
 *
 * @param {INetworkConfig} config
 *
 * @returns {void}
 */

export function updateClientOptions(config: INetworkConfig): void {
    const clientOptions = buildClientOptions(config)
    if (!clientOptions.node) {
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

    // TODO: Replace with profileManager api
    // api.setClientOptions(clientOptions, {
    //     onSuccess() {
    //         const { accounts } = get(activeProfile)
    //         accounts.set(get(accounts).map((a) => ({ ...a, clientOptions })))
    //     },
    //     onError(err) {
    //         console.error(err)
    //     },
    // })
}

function buildClientOptions(config: INetworkConfig): IClientOptions {
    const nodes = getNodeCandidates(config).map((n) => ({ ...n, network: config.network }))
    return {
        ...config,
        nodes,
        network: config.network.id,
    }
}
