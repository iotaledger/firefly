import { NetworkId } from '../enums'

export const CHRONICLE_URLS: Readonly<{ [key in NetworkId]?: string[] }> = {
    [NetworkId.Iota]: ['https://chronicle.stardust-mainnet.iotaledger.net/'],
    [NetworkId.IotaTestnet]: ['https://chronicle.testnet.shimmer.network/'], // TODO: update when testnet is available
    [NetworkId.IotaAlphanet]: ['https://chronicle.alphanet.iotaledger.net/'],
    [NetworkId.Shimmer]: ['https://chronicle.shimmer.network/'],
    [NetworkId.ShimmerTestnet]: ['https://chronicle.testnet.shimmer.network/'],
}

export const CHRONICLE_ADDRESS_HISTORY_ROUTE = 'api/explorer/v2/ledger/updates/by-address/'
