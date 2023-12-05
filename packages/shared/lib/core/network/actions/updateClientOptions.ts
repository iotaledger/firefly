import { ClientOptions } from '@core/network'
import { activeProfile, updateActiveProfile } from '@core/profile'
import { get } from 'svelte/store'
import { setClientOptions } from '@core/wallet'

/**
 * Update the client options for a profile.
 *
 * @method updateClientOptions
 *
 * @param {Partial<ClientOptions>} clientOptions
 *
 * @returns {void}
 */

export function updateClientOptions(clientOptionsToUpdate: Partial<ClientOptions>): Promise<void> {
    const currentClientOptions = get(activeProfile)?.clientOptions
    const clientOptions = { ...currentClientOptions, ...clientOptionsToUpdate }
    if (clientOptions?.nodes || clientOptions?.primaryNode) {
        updateActiveProfile({ clientOptions })
        return setClientOptions(clientOptions)
    } else {
        return Promise.reject('Must have at least one node set in the client options')
    }
}
