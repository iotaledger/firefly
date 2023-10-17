import { Balance } from '@iota/sdk/out/types'
import { AddressWithOutputs, IAccount } from './'
import { IPersistedAccountData } from './persisted-account-data.interface'

export interface IAccountState extends IAccount, IPersistedAccountData {
    index: number
    depositAddress: string
    balances: Balance
    isTransferring: boolean
    hasVotingPowerTransactionInProgress: boolean
    hasVotingTransactionInProgress: boolean
    hasConsolidatingOutputsTransactionInProgress: boolean
    votingPower: string
    addressesWithOutputs: AddressWithOutputs[]
}
