import { ChainMetadata } from '../types'
import { IChainStatus } from './chain-status.interface'

export interface IChain {
    getMetadata(): ChainMetadata
    getStatus(): IChainStatus
    getLatestBlock(): number
}
