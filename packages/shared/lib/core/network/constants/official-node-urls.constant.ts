import { NetworkId } from '../enums'

export const OFFICIAL_NODE_URLS: Readonly<{ [key in NetworkId]?: string[] }> = {
    [NetworkId.Iota]: ['https://api.stardust-mainnet.iotaledger.net', 'https://iota-node.tanglebay.com'],
    [NetworkId.IotaTestnet]: ['https://api.testnet.shimmer.network'], // TODO: Update this value when the testnet is ready
    [NetworkId.IotaAlphanet]: ['https://api.iota-alphanet.iotaledger.net'],
    [NetworkId.Shimmer]: ['https://api.shimmer.network', 'https://shimmer-node.tanglebay.com'],
    [NetworkId.ShimmerTestnet]: ['https://api.testnet.shimmer.network'],
}
