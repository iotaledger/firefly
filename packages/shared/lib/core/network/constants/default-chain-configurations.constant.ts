import { NetworkId } from '../enums'
import { ChainMetadata } from '../types'

export const DEFAULT_CHAIN_CONFIGURATIONS: Readonly<{ [id in NetworkId]?: ChainMetadata }> = {}
