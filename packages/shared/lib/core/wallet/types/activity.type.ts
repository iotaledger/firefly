import { AliasActivity, FoundryActivity } from './activities'
import { NftActivity } from './activities/nft-activity.type'
import { TransactionActivity } from './activities/transaction-activity.type'

export type Activity = TransactionActivity | AliasActivity | FoundryActivity | NftActivity
