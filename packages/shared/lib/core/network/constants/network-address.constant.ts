import { DestinationNetwork, NetworkType } from '../enums'

export const NETWORK_ADDRESS: Readonly<{ [key in NetworkType]?: { [key in DestinationNetwork]?: string } }> = {
    [NetworkType.Mainnet]: {
        [DestinationNetwork.Shimmer]: '-',
        // [DestinationNetwork.ShimmerEvm]: 'TO_DO',
    },
    [NetworkType.Devnet]: {
        [DestinationNetwork.Shimmer]: '-',
        [DestinationNetwork.ShimmerEvm]: 'rms1prr4r7az8e46qhagz5atugjm6x0xrg27d84677e3lurg0s6s76jr59dw4ls',
    },
}
