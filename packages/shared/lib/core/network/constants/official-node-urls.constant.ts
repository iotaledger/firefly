import { NetworkId } from '../enums'

export const OFFICIAL_NODE_URLS: Readonly<{ [key in NetworkId]?: string[] }> = {
    [NetworkId.Iota]: [
        'https://chrysalis-nodes.iota.org',
        'https://chrysalis-nodes.iota.cafe',
        'https://iota-node.tanglebay.com',
    ],
    [NetworkId.Shimmer]: ['https://api.shimmer.network'],
    [NetworkId.Testnet]: ['https://api.testnet.shimmer.network'],
}
