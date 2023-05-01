import { ChainConfiguration, ChainMetadata } from '../types'
import { IBlock } from './block.interface'
import { IChainStatus } from './chain-status.interface'

export interface IChain {
    getConfiguration(): ChainConfiguration
    getStatus(): IChainStatus
    getMetadata(): Promise<ChainMetadata>

    getLatestBlock(): Promise<IBlock>
}
