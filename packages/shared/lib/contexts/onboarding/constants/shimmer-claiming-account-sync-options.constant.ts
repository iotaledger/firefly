import type { SyncOptions } from '@iota/sdk/out/types'

export const SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS: SyncOptions = {
    account: {
        accountOutputs: false,
        basicOutputs: false,
        nftOutputs: false,
        foundryOutputs: false,
    },
    nft: {
        accountOutputs: false,
        basicOutputs: false,
        nftOutputs: false,
    },
    syncOnlyMostBasicOutputs: true,
    syncPendingTransactions: false,
    syncIncomingTransactions: false,
}
