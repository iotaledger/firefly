import type { SyncOptions } from '@iota/sdk/out/types'

export interface RecoverAccountsPayload {
    accountStartIndex: number // TODO(2.0) Should this be using index?
    accountGapLimit: number
    addressGapLimit: number
    syncOptions?: SyncOptions
}
