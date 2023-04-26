import { ChainMetadata, NetworkMetadata } from '../types'

export interface IPersistedNetwork extends NetworkMetadata {
    chains: ChainMetadata[]
}
