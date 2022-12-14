import { NetworkType } from '@core/network/enums'
import { DestinationNetwork } from '../enums'

export const NETWORK_ADDRESS: Readonly<{ [key in NetworkType]?: { [key in DestinationNetwork]?: string } }> = {
    [NetworkType.Mainnet]: {
        [DestinationNetwork.Shimmer]: '-',
        // [DestinationNetwork.ShimmerEvm]: 'TO_DO',
    },
    [NetworkType.Devnet]: {
        [DestinationNetwork.Shimmer]: '-',
        [DestinationNetwork.ShimmerTestnetEvm]: 'rms1pzewp89fyvxsxw80uaa0fuvypltvr93g2grzfxx9z7xex70yywa9k7vskka',
    },
    [NetworkType.PrivateNet]: {
        [DestinationNetwork.Shimmer]: '-',
    },
}
