import { ChainMetadata, NetworkMetadata } from '../types'
import { IChain } from './chain.interface'
import { INetworkStatus } from './network-status.interface'

export interface INetwork {
    getMetadata(): NetworkMetadata
    getStatus(): INetworkStatus

    getChain(chainId: number): IChain
    getChains(): IChain[]
    addChain(payload: ChainMetadata): Promise<IChain>
    editChain(chainId: number, payload: Partial<ChainMetadata>): Promise<void>
    removeChain(chainId: number): void
}
