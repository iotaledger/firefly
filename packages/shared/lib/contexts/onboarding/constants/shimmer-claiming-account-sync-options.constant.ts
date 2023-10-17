import type { SyncOptions } from '@iota/sdk/out/types'

export const SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS: SyncOptions = {
    alias: {
        aliasOutputs: false,
        basicOutputs: false,
        nftOutputs: false,
        foundryOutputs: false,
    },
    nft: {
        aliasOutputs: false,
        basicOutputs: false,
        nftOutputs: false,
    },
    syncOnlyMostBasicOutputs: true,
    syncPendingTransactions: false,
    syncIncomingTransactions: false,
}
