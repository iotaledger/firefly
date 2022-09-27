import { AccountSyncOptions } from '@iota/wallet'

export const SHIMMER_CLAIMING_ACCOUNT_SYNC_OPTIONS: AccountSyncOptions = {
    syncOnlyMostBasicOutputs: true,
    syncAliasesAndNfts: false,
    syncPendingTransactions: false,
    syncIncomingTransactions: false,
}
