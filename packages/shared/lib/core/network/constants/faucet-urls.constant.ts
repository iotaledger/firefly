import { NetworkId } from '../enums'

export const FAUCET_URLS: Readonly<{ [key in NetworkId]?: string }> = {
    [NetworkId.IotaAlphanet]: 'https://faucet.iota-alphanet.iotaledger.net/api/enqueue',
    [NetworkId.ShimmerTestnet]: 'https://faucet.testnet.shimmer.network/api/enqueue',
}
