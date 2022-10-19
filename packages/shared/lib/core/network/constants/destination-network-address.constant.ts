import { DestinationNetwork } from '../enums'

export const DESTINATION_NETWORK_ADDRESS: Readonly<{ [key in DestinationNetwork]?: string }> = {
    [DestinationNetwork.Shimmer]: '',
    [DestinationNetwork.ShimmerEvm]: 'rms',
}
