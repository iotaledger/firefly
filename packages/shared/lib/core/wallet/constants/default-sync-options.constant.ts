import type { SyncOptions } from '@iota/sdk/out/types'

export const DEFAULT_SYNC_OPTIONS: SyncOptions = {
    account: {
        basicOutputs: true,
        accountOutputs: true,
        nftOutputs: true,
        foundryOutputs: true,
    },
    wallet: {
        basicOutputs: true,
        accountOutputs: true,
    },
    nft: {
        accountOutputs: false,
        basicOutputs: false,
        nftOutputs: false,
    },
    syncIncomingTransactions: true,
    syncNativeTokenFoundries: true,
    // syncImplicitAccounts: true,
}
