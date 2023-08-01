import { NetworkId } from '../enums'

export const COIN_TYPE: Readonly<{ [key in NetworkId]: number }> = {
    [NetworkId.Iota]: 4218,
    [NetworkId.IotaTestnet]: 1,
    [NetworkId.Shimmer]: 4219,
    [NetworkId.Testnet]: 1,
    [NetworkId.Custom]: 1,
}

export const ETH_COIN_TYPE = 60
