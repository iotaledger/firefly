import { ChainConfiguration, ChainMetadata, Web3Provider } from '../types'
import { IBlock } from './block.interface'
import { IChainStatus } from './chain-status.interface'

export interface IChain {
    getConfiguration(): ChainConfiguration
    getStatus(): IChainStatus
    getMetadata(): Promise<ChainMetadata>
    getProvider(): Web3Provider

    getLatestBlock(): Promise<IBlock>
}
