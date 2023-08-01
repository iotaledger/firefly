import { Balance } from '@iota/wallet'
import { AddressWithOutputs, IAccount } from './'
import { IPersistedAccountData } from './persisted-account-data.interface'

export interface IAccountState extends IAccount, IPersistedAccountData {
    index: number
    depositAddress: string
    balances: Balance
    isTransferring: boolean
    hasVotingPowerTransactionInProgress: boolean
    hasVotingTransactionInProgress: boolean
    votingPower: string
    addressesWithOutputs: AddressWithOutputs[]
}
