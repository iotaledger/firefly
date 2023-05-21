/* eslint-disable @typescript-eslint/no-unused-vars */

import { get } from 'svelte/store'

import { activeProfile, updateActiveProfile } from '@core/profile/stores'

import { ChainType } from '../enums'
import { IChain, IIscpChainConfiguration, INetwork, INetworkStatus } from '../interfaces'
import { networkStatus } from '../stores'
import { ChainConfiguration, NetworkMetadata } from '../types'

import { IscpChain } from './iscp-chain.class'

export class StardustNetwork implements INetwork {
    private readonly _metadata: NetworkMetadata
    private readonly _chains: IChain[]

    constructor(metadata: NetworkMetadata, chainConfigurations: ChainConfiguration[]) {
        this._metadata = metadata
        this._chains = this.constructChains(chainConfigurations ?? [])
    }

    private constructChains(chainConfigurations: ChainConfiguration[]): IChain[] {
        const chains = chainConfigurations.map((chainConfiguration) => {
            switch (chainConfiguration.type) {
                case ChainType.Iscp:
                    return new IscpChain(chainConfiguration)
                case ChainType.Evm:
                    return undefined
                default:
                    return undefined
            }
        })
        return chains.filter((chain) => chain !== undefined) as IChain[]
    }

    getMetadata(): NetworkMetadata {
        return this._metadata
    }

    getStatus(): INetworkStatus {
        return get(networkStatus) ?? {}
    }

    getChain(chainId: number): IChain | undefined {
        return this._chains.find((chain) => chain?.getConfiguration().chainId === chainId)
    }

    getChains(): IChain[] {
        return this._chains
    }

    addChain(chainConfiguration: ChainConfiguration): IChain {
        if (this.isChainAlreadyAdded(chainConfiguration)) {
            throw new Error('This chain has already been added.')
        } else {
            const network = get(activeProfile)?.network
            network.chainConfigurations.push(chainConfiguration)
            /**
             * NOTE: Updating the active profile will cause the network store object to be
             * re-instantiated, which will also instantiate an object for the newly added
             * chain.
             */
            updateActiveProfile({ network })

            return new IscpChain(<IIscpChainConfiguration>chainConfiguration)
        }
    }

    private isChainAlreadyAdded(chainConfiguration: ChainConfiguration): boolean {
        const network = get(activeProfile)?.network
        return network.chainConfigurations.some((chain) => {
            const hasSameName = chain.name === chainConfiguration.name
            const hasSameChainId = chain.chainId === chainConfiguration.chainId
            return hasSameName || hasSameChainId
        })
    }

    editChain(chainId: number, payload: Partial<ChainConfiguration>): Promise<void> {
        return Promise.resolve()
    }

    removeChain(chainId: number): void {
        const network = get(activeProfile).network
        const newChains = network.chainConfigurations.filter(
            (chainConfiguration) => chainConfiguration.chainId !== chainId
        )
        updateActiveProfile({ network: { ...network, chainConfigurations: newChains } })
    }
}
