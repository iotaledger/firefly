import { IIscpChainMetadata } from '../interfaces'
import { ChainMetadata } from '../types'

export function isIscpChain(configuration: ChainMetadata): configuration is IIscpChainMetadata {
    return (configuration as IIscpChainMetadata) !== undefined
}
