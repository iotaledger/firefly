/* eslint-disable @typescript-eslint/no-unused-vars */

import { get } from 'svelte/store'

import { activeProfile } from '@core/profile'

import { IChain, INetwork, INetworkStatus } from '../interfaces'
import { networkStatus } from '../stores'
import { ChainMetadata, NetworkMetadata } from '../types'

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

    addChain(payload: ChainMetadata): Promise<IChain> {
        console.log('ADDING CHAIN: ', payload)

        return undefined
    }

    editChain(chainId: number, payload: Partial<ChainMetadata>): Promise<void> {
        return Promise.resolve()
    }

    removeChain(chainId: number): void {}
}
