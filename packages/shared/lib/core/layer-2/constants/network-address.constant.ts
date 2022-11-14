import { DestinationNetwork, NetworkType } from '../../network/enums'

export const NETWORK_ADDRESS: Readonly<{ [key in NetworkType]?: { [key in DestinationNetwork]?: string } }> = {
    [NetworkType.Mainnet]: {
        [DestinationNetwork.Shimmer]: '-',
        // [DestinationNetwork.ShimmerEvm]: 'TO_DO',
    },
    [NetworkType.Devnet]: {
        [DestinationNetwork.Shimmer]: '-',
        [DestinationNetwork.ShimmerTestnetEvm]: 'rms1pzw5y4e4y6gzkytvjp0ukgjgs37vd33uvnju9tuf6rrztnnw4tj7crw72ar',
    },
}
