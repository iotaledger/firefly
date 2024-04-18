import type { SyncOptions } from '@iota/sdk/out/types'

export interface RecoverAccountsPayload {
    accountStartIndex: number
    accountGapLimit: number
    addressGapLimit: number
    syncOptions?: SyncOptions
}
