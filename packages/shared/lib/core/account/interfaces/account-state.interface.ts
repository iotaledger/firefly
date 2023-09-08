import { Balance } from '@iota/sdk/out/types'
import { IAccount } from './account.interface'
import { IPersistedAccountData } from './persisted-account-data.interface'

export interface IAccountState extends IAccount, IPersistedAccountData {
    index: number
    depositAddress: string
    balances: Balance
    isTransferring: boolean
    hasVotingPowerTransactionInProgress: boolean
    hasVotingTransactionInProgress: boolean
    votingPower: string
}
