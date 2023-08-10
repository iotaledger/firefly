import { Balance } from '@iota/sdk/out/types'
import { IPersistedAccountData } from './persisted-account-data.interface'
import { IAccount } from './account.interface'

export interface IAccountState extends IAccount, IPersistedAccountData {
    index: number
    depositAddress: string
    balances: Balance
    isTransferring: boolean
    hasVotingPowerTransactionInProgress: boolean
    hasVotingTransactionInProgress: boolean
    votingPower: string
}
