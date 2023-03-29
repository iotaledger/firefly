import { NetworkType } from '@core/network/enums'
import { DestinationNetwork } from '../enums'

export const NETWORK_ADDRESS: Readonly<{ [key in NetworkType]?: { [key in DestinationNetwork]?: string } }> = {
    [NetworkType.Mainnet]: {
        [DestinationNetwork.Shimmer]: '-',
        // [DestinationNetwork.ShimmerEvm]: 'TO_DO',
    },
    [NetworkType.Devnet]: {
        [DestinationNetwork.Shimmer]: '-',
        [DestinationNetwork.ShimmerTestnetEvm]: 'rms1prwgvvw472spqusqeufvlmp8xdpyxtrnmvt26jnuk6sxdcq2hk8scku26h7',
    },
    [NetworkType.PrivateNet]: {
        [DestinationNetwork.Shimmer]: '-',
    },
}
