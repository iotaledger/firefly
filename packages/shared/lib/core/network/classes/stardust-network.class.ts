/* eslint-disable @typescript-eslint/no-unused-vars */

import { get } from 'svelte/store'

import { activeProfile, updateActiveProfile } from '@core/profile/stores'

import { ChainType } from '../enums'
import { IChain, IIscpChainMetadata, INetwork, INetworkStatus } from '../interfaces'
import { addChain, chains, getChain, networkStatus, removeChain } from '../stores'
import { ChainMetadata, NetworkMetadata } from '../types'

import { IscpChain } from './iscp-chain.class'

export class StardustNetwork implements INetwork {
    private readonly _metadata: NetworkMetadata

    constructor(metadata: NetworkMetadata) {
        this._metadata = metadata
    }

    getMetadata(): NetworkMetadata {
        return this._metadata
    }

    getStatus(): INetworkStatus {
        return get(networkStatus) ?? {}
    }

    getChain(chainId: number): IChain {
        return getChain(chainId)
    }

    getChains(): IChain[] {
        return get(chains)
    }

    addChain(payload: ChainMetadata): IChain {
        let chain: IChain

        const network = get(activeProfile)?.network
        if (network) {
            if (this.isChainAlreadyAdded(payload)) {
                throw new Error('This chain has already been added.')
            } else {
                const isIscpChain = payload.type === ChainType.Iscp
                chain = isIscpChain ? new IscpChain(payload) : undefined
                addChain(chain)
                network.chains.push(payload)
                updateActiveProfile({ network })
            }
        } else {
            throw new Error('Unable to find network.')
        }

        return chain
    }

    private isChainAlreadyAdded(chainMetadata: ChainMetadata): boolean {
        const network = get(activeProfile)?.network
        return network.chains.some((chain) => {
            const hasSameName = chain.name === chainMetadata.name
            const hasSameChainId = chain.chainId === chainMetadata.chainId
            return hasSameName || hasSameChainId
        })
    }

    editChain(chainId: number, payload: Partial<ChainMetadata>): Promise<void> {
        return Promise.resolve()
    }

    removeChain(chainId: number): void {
        const network = get(activeProfile).network
        const newChains = network.chains.filter((chain) => chain.chainId !== chainId)
        updateActiveProfile({ network: { ...network, chains: newChains } })
        removeChain(chainId)
    }
}
