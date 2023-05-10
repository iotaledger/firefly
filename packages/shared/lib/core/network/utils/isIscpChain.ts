import { ChainConfiguration } from '../types'
import { IIscpChainConfiguration } from '../interfaces'

export function isIscpChain(configuration: ChainConfiguration): configuration is IIscpChainConfiguration {
    return (configuration as IIscpChainConfiguration) !== undefined
}
