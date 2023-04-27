import { get } from 'svelte/store'

import { activeProfile } from '@core/profile'

import { IscpChain, StardustNetwork } from '../classes'
import { addChain, network } from '../stores'
import { ChainType, IIscpChainMetadata } from '@core/network'

export function buildNetworkAndChainsObjects(): void {
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
        const chain = isIscpChain ? new IscpChain(<IIscpChainMetadata>chainMetadata) : undefined
        addChain(chain)
    }
}
