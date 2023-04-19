import { NetworkId } from '../enums'

export const FAUCET_URLS: Readonly<{ [key in NetworkId]?: string }> = {
    [NetworkId.Testnet]: 'https://faucet.testnet.shimmer.network/api/enqueue',
}
