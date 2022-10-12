import { AccountSyncOptions } from '@iota/wallet'

export interface RecoverAccountsPayload {
    accountStartIndex: number
    accountGapLimit: number
    addressGapLimit: number
    syncOptions?: AccountSyncOptions
}
