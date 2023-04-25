import { NetworkId } from '../enums'

export const COIN_TYPE: Readonly<{ [key in NetworkId]?: number }> = {
    [NetworkId.Iota]: 4218,
    [NetworkId.Shimmer]: 4219,
    [NetworkId.Testnet]: 1,
}
