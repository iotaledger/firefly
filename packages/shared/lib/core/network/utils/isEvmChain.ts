import { IEvmChainMetadata } from '../interfaces'
import { ChainMetadata } from '../types'

export function isEvmChain(configuration: ChainMetadata): configuration is IEvmChainMetadata {
    return (configuration as IEvmChainMetadata) !== undefined
}
