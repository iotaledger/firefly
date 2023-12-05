import { Balance } from '@iota/sdk/out/types'
import { IWallet } from '@core/profile/interfaces'
import { AddressWithOutputs } from './address-with-outputs.interface'
import { IPersistedWalletData } from './persisted-wallet-data.interface'

export interface IWalletState extends IWallet, IPersistedWalletData {
    id: string
    depositAddress: string
    balances: Balance
    isTransferring: boolean
    hasVotingPowerTransactionInProgress: boolean
    hasVotingTransactionInProgress: boolean
    hasConsolidatingOutputsTransactionInProgress: boolean
    votingPower: string
    addressesWithOutputs: AddressWithOutputs[]
}
