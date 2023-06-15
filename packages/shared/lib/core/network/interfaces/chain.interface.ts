import { ContractType } from '@core/layer-2/enums'
import { Contract, ContractAbi } from 'web3'

import { ChainConfiguration, ChainMetadata, Web3Provider } from '../types'
import { IBlock } from './block.interface'
import { IChainStatus } from './chain-status.interface'

export interface IChain {
    getConfiguration(): ChainConfiguration
    getStatus(): IChainStatus
    getProvider(): Web3Provider

    getMetadata(): Promise<ChainMetadata>
    getContract<T extends ContractAbi>(type: ContractType, address: string): Contract<T>

    getLatestBlock(): Promise<IBlock>
}
