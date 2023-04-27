import { ChainConfiguration, ChainMetadata } from '../types'
import { IBlock } from './block.interface'
import { IChainStatus } from './chain-status.interface'

export interface IChain {
    getConfiguration(): ChainConfiguration
    getMetadata(): Promise<ChainMetadata>
    getStatus(): Promise<IChainStatus>

    getLatestBlock(): Promise<IBlock>
}
