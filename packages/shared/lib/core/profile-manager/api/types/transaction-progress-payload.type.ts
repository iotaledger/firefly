import { BlindLedgerTransaction } from './blind-ledger-transaction.type'
import { RegularTransaction } from './regular-transaction.type'

export type TransactionProgressPayload =
    | 'PerformingPow'
    | 'SigningTransaction'
    | RegularTransaction
    | BlindLedgerTransaction
