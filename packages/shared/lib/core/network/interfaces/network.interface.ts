import { ChainConfiguration, NetworkMetadata } from '../types'
import { IChain } from './chain.interface'
import { INetworkStatus } from './network-status.interface'

export interface INetwork {
    getMetadata(): NetworkMetadata
    getStatus(): INetworkStatus

    getChain(chainId: number): IChain | undefined
    getChains(): (IChain | undefined)[]
    addChain(chainConfiguration: ChainConfiguration): IChain
    editChain(chainId: number, payload: Partial<ChainConfiguration>): Promise<void>
    removeChain(chainId: number): void
}
