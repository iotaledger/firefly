import { NetworkType } from '@core/network/enums'
import { DestinationNetwork } from '../enums'

export const NETWORK_ADDRESS: Readonly<{ [key in NetworkType]?: { [key in DestinationNetwork]?: string } }> = {
    [NetworkType.Mainnet]: {
        [DestinationNetwork.Shimmer]: '-',
        // [DestinationNetwork.ShimmerEvm]: 'TO_DO',
    },
    [NetworkType.Devnet]: {
        [DestinationNetwork.Shimmer]: '-',
        [DestinationNetwork.ShimmerTestnetEvm]: 'rms1pp4kmrl9n9yy9n049x7kk8h4atm0tu76redhj5wrc2jsskk2vukwxvtgk9u',
    },
    [NetworkType.PrivateNet]: {
        [DestinationNetwork.Shimmer]: '-',
    },
}
