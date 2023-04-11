import { NetworkId } from '../enums'
import { TESTNET_COIN_TYPE } from './testnet-coin-type.constant'

export const COIN_TYPE: Readonly<{ [key in NetworkId]?: number }> = {
    [NetworkId.Iota]: 4218,
    [NetworkId.Shimmer]: 4219,
    [NetworkId.Testnet]: TESTNET_COIN_TYPE,
    [NetworkId.Custom]: TESTNET_COIN_TYPE,
}
