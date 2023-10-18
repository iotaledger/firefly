import {
    AliasActivity,
    ConsolidationActivity,
    FoundryActivity,
    GovernanceActivity,
    NftActivity,
    TransactionActivity,
    VestingActivity,
} from './activities'

export type Activity =
    | TransactionActivity
    | AliasActivity
    | FoundryActivity
    | NftActivity
    | GovernanceActivity
    | ConsolidationActivity
    | VestingActivity
