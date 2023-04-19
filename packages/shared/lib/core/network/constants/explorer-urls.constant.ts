import { NetworkId } from '../enums'

export const EXPLORER_URLS: Readonly<{ [key in NetworkId]?: string }> = {
    [NetworkId.Iota]: 'https://explorer.iota.org/mainnet',
    [NetworkId.Shimmer]: 'https://explorer.shimmer.network/shimmer',
    [NetworkId.Testnet]: 'https://explorer.shimmer.network/testnet',
}
