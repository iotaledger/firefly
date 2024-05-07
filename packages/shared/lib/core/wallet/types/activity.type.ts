import {
    AccountActivity,
    AnchorActivity,
    ConsolidationActivity,
    DelegationActivity,
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
    | DelegationActivity
    | AnchorActivity
