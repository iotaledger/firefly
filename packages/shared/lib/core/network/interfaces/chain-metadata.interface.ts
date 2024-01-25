import { ChainType } from '../enums'

export interface IBaseChainMetadata {
    type: ChainType
    chainId: number
    name: string
    explorerUrl?: string
}

export interface IIscpChainMetadata extends IBaseChainMetadata {
    type: ChainType.Iscp
    accountAddress: string
    iscpEndpoint: string
}
