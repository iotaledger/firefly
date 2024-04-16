import { NetworkId } from '../enums'

export const EXPLORER_URLS: Readonly<{ [key in NetworkId]?: string }> = {
    [NetworkId.Iota]: 'https://explorer.iota.org/mainnet',
    [NetworkId.IotaAlphanet]: 'https://explorer.iota-alphanet.iotaledger.net/devnet',
    [NetworkId.IotaTestnet]: 'https://explorer.shimmer.network/iota-testnet', // TODO: update when testnet is available
    [NetworkId.Shimmer]: 'https://explorer.shimmer.network/shimmer',
    [NetworkId.ShimmerTestnet]: 'https://explorer.shimmer.network/shimmer-testnet',
}
