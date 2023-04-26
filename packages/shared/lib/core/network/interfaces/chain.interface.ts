import { ChainMetadata } from '../types'
import { IBlock } from './block.interface'
import { IChainStatus } from './chain-status.interface'

export interface IChain {
    getMetadata(): ChainMetadata
    getStatus(): IChainStatus

    getLatestBlock(): Promise<IBlock>
}
