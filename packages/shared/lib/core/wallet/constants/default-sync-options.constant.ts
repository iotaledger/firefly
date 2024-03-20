import type { SyncOptions } from '@iota/sdk/out/types'

export const DEFAULT_SYNC_OPTIONS: SyncOptions = {
    account: {
        basicOutputs: true,
        accountOutputs: true,
        nftOutputs: true,
        foundryOutputs: true,
        delegationOutputs: true,
    },
    wallet: {
        basicOutputs: true,
        accountOutputs: true,
        delegationOutputs: true,
    },
    nft: {
        accountOutputs: false,
        basicOutputs: false,
        nftOutputs: false,
    },
    syncIncomingTransactions: true,
    syncNativeTokenFoundries: true,
}
