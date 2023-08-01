import type { SyncOptions } from '@iota/wallet/out/types'

export interface RecoverAccountsPayload {
    accountStartIndex: number
    accountGapLimit: number
    addressGapLimit: number
    syncOptions?: SyncOptions
}
