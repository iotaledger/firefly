import { NetworkId } from '../enums'

export const FAUCET_URLS: Readonly<{ [key in NetworkId]?: string }> = {
    [NetworkId.IotaTestnet]: 'https://faucet.testnet.shimmer.network/api/enqueue', // TODO: update when testnet is available
    [NetworkId.IotaAlphanet]: 'https://faucet.iota-alphanet.iotaledger.net/api/enqueue',
    [NetworkId.ShimmerTestnet]: 'https://faucet.testnet.shimmer.network/api/enqueue',
}
