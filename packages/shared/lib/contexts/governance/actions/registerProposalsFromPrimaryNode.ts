import { get } from 'svelte/store'

import { activeProfile } from '@core/profile/stores'

import { registerProposalsFromNode } from './registerProposalsFromNode'

export async function registerProposalsFromPrimaryNode(): Promise<void> {
    const clientOptions = get(activeProfile)?.clientOptions
    if (!clientOptions) {
        throw new Error('Unable to retrieve profile client options')
    }

    const primaryNode = clientOptions?.primaryNode
    if (!primaryNode) {
        throw new Error('Unable to retrieve primary node')
    }

    await registerProposalsFromNode(primaryNode)
}
