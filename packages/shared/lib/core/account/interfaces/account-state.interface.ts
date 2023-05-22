import { IEvmAddresses } from '@core/network/interfaces'
import { AccountBalance } from '@iota/wallet'
import { IAccountPersistedData } from './account-persisted-data.interface'
import { IAccount } from './account.interface'

export interface IAccountState extends IAccount, IAccountPersistedData {
    index: number
    depositAddress: string
    evmAddresses: IEvmAddresses
    balances: AccountBalance
    isTransferring: boolean
    hasVotingPowerTransactionInProgress: boolean
    hasVotingTransactionInProgress: boolean
    votingPower: string
}
