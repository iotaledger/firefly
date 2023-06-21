import { ChainConfiguration, ChainMetadata } from '../types'

export interface IChain {
    getConfiguration(): ChainConfiguration
    getMetadata(): Promise<ChainMetadata>
}
