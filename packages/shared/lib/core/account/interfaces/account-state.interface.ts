import { AccountBalance } from '@iota/wallet'
import { IAccountMetadata } from './account-metadata.interface'
import { IAccount } from './account.interface'
import { GovernanceTransactionType } from '@contexts/governance/enums/governance-transaction-type.enum'

export interface IAccountState extends IAccount, IAccountMetadata {
    depositAddress: string
    balances: AccountBalance
    isTransferring: boolean
    processingGovernanceTransactionType: GovernanceTransactionType
    shouldRevote: boolean
    votingPower: string
}
