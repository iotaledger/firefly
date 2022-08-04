import { NetworkProtocol, NetworkType } from '../enums'

export const FAUCET_URL: Readonly<{ [key in NetworkProtocol]?: { [key in NetworkType]?: string } }> = {
    [NetworkProtocol.Shimmer]: {
        [NetworkType.Devnet]: 'https://faucet.testnet.shimmer.network/api/enqueue',
    },
}
