import { DestinationNetwork } from '../enums'

export const DESTINATION_NETWORK_ADDRESS: Readonly<{ [key in DestinationNetwork]?: string }> = {
    [DestinationNetwork.Shimmer]: '-',
    [DestinationNetwork.ShimmerEvm]: 'rms1qrut5ajyfrtgjs325kd9chwfwyyy2z3fewy4vgy0vvdtf2pr8prg5u3zwjn',
}
