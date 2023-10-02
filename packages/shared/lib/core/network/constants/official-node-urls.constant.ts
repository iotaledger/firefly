import { NetworkId } from '../enums'

export const OFFICIAL_NODE_URLS: Readonly<{ [key in NetworkId]?: string[] }> = {
    [NetworkId.Iota]: ['https://api.stardust-mainnet.iotaledger.net:8443'],
    [NetworkId.IotaAlphanet]: ['https://api.iota-alphanet.iotaledger.net'],
    [NetworkId.Shimmer]: ['https://api.shimmer.network'],
    [NetworkId.Testnet]: ['https://api.testnet.shimmer.network'],
}
