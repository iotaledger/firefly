import { NetworkId } from '../enums'
import { NetworkMetadata } from '../types'

export type NetworkMetadataMap = {
    [key in NetworkId]?: NetworkMetadata
}
