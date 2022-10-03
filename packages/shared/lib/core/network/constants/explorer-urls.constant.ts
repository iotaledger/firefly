import { NetworkProtocol, NetworkType } from '../enums'

export const EXPLORER_URLS: Readonly<{ [key in NetworkProtocol]?: { [key in NetworkType]?: string } }> = {
    [NetworkProtocol.IOTA]: {
        [NetworkType.Mainnet]: 'https://explorer.iota.org/mainnet',
        [NetworkType.Devnet]: 'https://explorer.iota.org/devnet',
    },
    [NetworkProtocol.Shimmer]: {
        [NetworkType.Mainnet]: 'https://explorer.shimmer.network/shimmer',
        [NetworkType.Devnet]: 'https://explorer.shimmer.network/testnet',
    },
}
