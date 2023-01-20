import {
    AliasActivity,
    ConsolidationActivity,
    FoundryActivity,
    GovernanceActivity,
    NftActivity,
    TransactionActivity,
} from './activities'

export type Activity =
    | TransactionActivity
    | AliasActivity
    | FoundryActivity
    | NftActivity
    | GovernanceActivity
    | ConsolidationActivity
