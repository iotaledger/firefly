import { NetworkProtocol, NetworkType } from '../enums'

export const OFFICIAL_NODE_URLS: Readonly<{ [key in NetworkProtocol]?: { [key in NetworkType]?: string[] } }> = {
    [NetworkProtocol.IOTA]: {
        [NetworkType.Mainnet]: [
            'https://chrysalis-nodes.iota.org',
            'https://chrysalis-nodes.iota.cafe',
            'https://mainnet-node.tanglebay.com',
        ],
        [NetworkType.Devnet]: [
            'https://api.lb-0.h.chrysalis-devnet.iota.cafe',
            'https://api.lb-1.h.chrysalis-devnet.iota.cafe',
        ],
    },
    [NetworkProtocol.Shimmer]: {
        [NetworkType.Mainnet]: [],
        [NetworkType.Devnet]: ['https://api.testnet.shimmer.network'],
    },
}
