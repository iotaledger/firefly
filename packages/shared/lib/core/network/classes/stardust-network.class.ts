/* eslint-disable @typescript-eslint/no-unused-vars */

import { get } from 'svelte/store'

import { activeProfile } from '@core/profile/stores'

import { IChain, IIscpChainMetadata, INetwork, INetworkStatus } from '../interfaces'
import { networkStatus } from '../stores'
import { ChainMetadata, NetworkMetadata } from '../types'

import { IscpChain } from './iscp-chain.class'

export class StardustNetwork implements INetwork {
    getMetadata(): NetworkMetadata {
        return get(activeProfile)?.network
    }

    getStatus(): INetworkStatus {
        return get(networkStatus) ?? {}
    }

    getChain(chainId: number): IChain {
        return undefined
    }

    getChains(): IChain[] {
        return []
    }

    addChain(payload: ChainMetadata): IChain {
        const chain = new IscpChain(<IIscpChainMetadata>payload)

        // persist metadata in store

        return chain
    }

    editChain(chainId: number, payload: Partial<ChainMetadata>): Promise<void> {
        return Promise.resolve()
    }

    removeChain(chainId: number): void {}
}
