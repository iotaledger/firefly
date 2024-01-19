import { NetworkId } from '../enums'

export const OFFICIAL_NODE_URLS: Readonly<{ [key in NetworkId]?: string[] }> = {
    [NetworkId.Iota]: ['https://api.stardust-mainnet.iotaledger.net', 'https://iota-node.tanglebay.com'],
    [NetworkId.IotaAlphanet]: ['https://api.iota-alphanet.iotaledger.net'],
    [NetworkId.Shimmer]: ['https://api.shimmer.network', 'https://shimmer-node.tanglebay.com'],
    [NetworkId.Testnet]: ['https://api.iota2-alphanet.iotaledger.net'],
}
