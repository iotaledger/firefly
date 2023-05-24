import { ContractType } from '@core/layer-2/enums'
import { Contract } from '@core/layer-2/types'

import { ChainConfiguration, ChainMetadata } from '../types'
import { IBlock } from './block.interface'
import { IChainStatus } from './chain-status.interface'

export interface IChain {
    getConfiguration(): ChainConfiguration
    getStatus(): IChainStatus
    getMetadata(): Promise<ChainMetadata>
    getContract(type: ContractType, address: string): Contract

    getLatestBlock(): Promise<IBlock>
}
