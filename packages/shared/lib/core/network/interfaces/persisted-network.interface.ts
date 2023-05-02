import { ChainConfiguration, NetworkMetadata } from '../types'

export interface IPersistedNetwork extends NetworkMetadata {
    chainConfigurations: ChainConfiguration[]
}
