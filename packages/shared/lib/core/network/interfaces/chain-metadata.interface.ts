import { ChainType } from '../enums'

export interface IChainMetadata {
    type: ChainType
    chainId: number
    name: string
    explorerUrl?: string
}

export interface IIscpChainMetadata extends IChainMetadata {
    type: ChainType.Iscp
    aliasAddress: string
    iscpEndpoint: string
}

export interface IEvmChainMetadata extends IChainMetadata {
    type: ChainType.Evm
    symbol: string
    ticker: string
    rpcEndpoint: string
}
