import { Balance } from '@iota/wallet'
import { IAccountMetadata } from './account-metadata.interface'
import { IAccount } from './account.interface'

export interface IAccountState extends IAccount, IAccountMetadata {
    depositAddress: string
    balances: Balance
    isTransferring: boolean
    hasVotingPowerTransactionInProgress: boolean
    hasVotingTransactionInProgress: boolean
    votingPower: string
}
