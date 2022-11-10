import { DestinationNetwork, NetworkType } from '../enums'

export const NETWORK_ADDRESS: Readonly<{ [key in NetworkType]?: { [key in DestinationNetwork]?: string } }> = {
    [NetworkType.Mainnet]: {
        [DestinationNetwork.Shimmer]: '-',
        // [DestinationNetwork.ShimmerEvm]: 'TO_DO',
    },
    [NetworkType.Devnet]: {
        [DestinationNetwork.Shimmer]: '-',
        // [DestinationNetwork.ShimmerEvm]: 'rms1qrut5ajyfrtgjs325kd9chwfwyyy2z3fewy4vgy0vvdtf2pr8prg5u3zwjn',
    },
}
