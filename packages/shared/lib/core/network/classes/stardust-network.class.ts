import { get } from 'svelte/store'

import { activeProfile, updateActiveProfile } from '@core/profile/stores'

import { ChainType } from '../enums'
import { IChain, IIscpChainMetadata, INetwork, INetworkStatus } from '../interfaces'
import { networkStatus } from '../stores'
import { ChainMetadata, NetworkMetadata } from '../types'

import { IscpChain } from './iscp-chain.class'

export class StardustNetwork implements INetwork {
    private readonly _metadata: NetworkMetadata
    private readonly _chains: IChain[]

    constructor(metadata: NetworkMetadata, chainMetadata: ChainMetadata[]) {
        this._metadata = metadata
        this._chains = chainMetadata.map((chain) => {
            switch (chain.type) {
                case ChainType.Iscp:
                    return new IscpChain(chain)
                default:
                    return undefined
            }
        })
    }

    getMetadata(): NetworkMetadata {
        return this._metadata
    }

    getStatus(): INetworkStatus {
        return get(networkStatus) ?? {}
    }

    getChain(chainId: number): IChain {
        return this._chains.find((chain) => chain.getMetadata().chainId === chainId)
    }

    getChains(): IChain[] {
        return this._chains
    }

    addChain(payload: ChainMetadata): IChain {
        if (this.isChainAlreadyAdded(payload)) {
            throw new Error('This chain has already been added.')
        } else {
            const network = get(activeProfile)?.network
            network.chains.push(payload)
            /**
             * NOTE: Updating the active profile will cause the network store object to be
             * re-instantiated, which will also instantiate an object for the newly added
             * chain.
             */
            updateActiveProfile({ network })

            return new IscpChain(<IIscpChainMetadata>payload)
        }
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
        /* eslint-disable no-console */
        console.log('EDITING: ', chainId, payload)
        return Promise.resolve()
    }

    removeChain(chainId: number): void {
        const network = get(activeProfile).network
        const newChains = network.chains.filter((chain) => chain.chainId !== chainId)
        updateActiveProfile({ network: { ...network, chains: newChains } })
    }
}
