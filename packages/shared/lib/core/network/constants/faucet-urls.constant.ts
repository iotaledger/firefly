import { NetworkId } from '../enums'

export const FAUCET_URLS: Readonly<{ [key in NetworkId]?: string }> = {
    [NetworkId.IotaTestnet]: 'https://faucet.iota-alphanet.iotaledger.net/',
    [NetworkId.Testnet]: 'https://faucet.testnet.shimmer.network/api/enqueue',
}
