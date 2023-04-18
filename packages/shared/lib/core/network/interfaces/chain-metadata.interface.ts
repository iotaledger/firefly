import { ChainType } from '../enums'

export interface IBaseChainMetadata {
    type: ChainType
    chainId: number
    name: string
    explorerUrl?: string
}

export interface IIscpChainMetadata extends IBaseChainMetadata {
    type: ChainType.Iscp
    aliasAddress: string
    iscpEndpoint: string
}

export interface IEvmChainMetadata extends IBaseChainMetadata {
    type: ChainType.Evm
    symbol: string
    ticker: string
    rpcEndpoint: string
}
