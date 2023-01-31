import type { SyncOptions } from '@iota/wallet'

export interface RecoverAccountsPayload {
    accountStartIndex: number
    accountGapLimit: number
    addressGapLimit: number
    syncOptions?: SyncOptions
}
