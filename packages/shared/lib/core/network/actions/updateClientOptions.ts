import { get } from 'svelte/store'
import { getNodeCandidates, INetworkConfig, IClientOptions } from '@core/network'
import { localize } from '@core/i18n'
import { isNewNotification, showAppNotification } from '@lib/notifications'
import { api } from '@lib/wallet'
import { activeProfile } from '@core/profile'

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

    const hasMismatchedNetwork = clientOptions.node?.network?.id !== clientOptions.network
    if (hasMismatchedNetwork && isNewNotification('warning')) {
        showAppNotification({
            type: 'error',
            message: localize('error.network.badNodes'),
        })

        return
    }

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
