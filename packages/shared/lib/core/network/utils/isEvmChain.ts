import { IEvmChainConfiguration } from '../interfaces'
import { ChainConfiguration } from '../types'

export function isEvmChain(configuration: ChainConfiguration): configuration is IEvmChainConfiguration {
    return (configuration as IEvmChainConfiguration) !== undefined
}
