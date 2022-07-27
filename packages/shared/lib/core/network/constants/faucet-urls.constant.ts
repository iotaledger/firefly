import { NetworkProtocol, NetworkType } from '../enums'

export const FAUCET_URLS: Readonly<{ [key in NetworkProtocol]?: { [key in NetworkType]?: string } }> = {
    [NetworkProtocol.Shimmer]: {
        [NetworkType.Devnet]: 'https://faucet.testnet.shimmer.network/api/enqueue',
    },
}
