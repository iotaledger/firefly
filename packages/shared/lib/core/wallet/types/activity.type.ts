import {
    AccountActivity,
    ConsolidationActivity,
    FoundryActivity,
    GovernanceActivity,
    NftActivity,
    TransactionActivity,
    VestingActivity,
} from './activities'

export type Activity =
    | TransactionActivity
    | AccountActivity
    | FoundryActivity
    | NftActivity
    | GovernanceActivity
    | ConsolidationActivity
    | VestingActivity
