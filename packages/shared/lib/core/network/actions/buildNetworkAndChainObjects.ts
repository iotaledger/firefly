import { get } from 'svelte/store'

import { activeProfile } from '@core/profile'

import { ChainType } from '../enums'
import { IscpChain, StardustNetwork } from '../classes'
import { IIscpChainMetadata } from '../interfaces'
import { addChain, network } from '../stores'

export function buildNetworkAndChainObjects(): void {
    buildNetwork()
    buildChains()
}

function buildNetwork(): void {
    const networkMetadata = get(activeProfile)?.network
    if (networkMetadata) {
        network.set(new StardustNetwork(networkMetadata))
    } else {
        throw new Error('Cannot build network object.')
    }
}

function buildChains(): void {
    const networkMetadata = get(activeProfile)?.network
    for (const chainMetadata of networkMetadata?.chains ?? []) {
        console.log('CHAIN METADATA: ', chainMetadata)
        const isIscpChain = chainMetadata.type === ChainType.Iscp
        // TODO: What if this fails because node / URL is offline?
        // We need specific error handling in the class constructor
        // so that the object is still created, but status is changed.
        // Does that mean that the created chain object will be provider-less?

        // TODO: Should this be hidden behind a factory so that from the UI level, we're only ever interacting
        // with a Chain object rather than knowing specifically if it is an IscpChain or EvmChain object...
        // Would need to diagram it out.
        const chain = isIscpChain ? new IscpChain(<IIscpChainMetadata>chainMetadata) : undefined
        addChain(chain)
    }
}
