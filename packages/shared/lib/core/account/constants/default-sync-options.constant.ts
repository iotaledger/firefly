import type { SyncOptions } from '@iota/sdk/out/types'

export const DEFAULT_SYNC_OPTIONS: SyncOptions = {
    account: {
        basicOutputs: true,
        aliasOutputs: true,
        nftOutputs: true,
    },
    alias: {
        aliasOutputs: false,
        basicOutputs: false,
        nftOutputs: false,
        foundryOutputs: true,
    },
    nft: {
        aliasOutputs: false,
        basicOutputs: false,
        nftOutputs: false,
    },
    syncIncomingTransactions: true,
    syncNativeTokenFoundries: true,
}
