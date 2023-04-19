import { NetworkId } from '../enums'
import { IStardustNetworkMetadata } from '../interfaces'

export type NetworkMetadataMap = {
    [key in NetworkId]?: IStardustNetworkMetadata
}
