import { OutputData } from '@iota/sdk/out/types'
import { IWallet } from '@core/profile/interfaces'
import { IPersistedWalletData } from './persisted-wallet-data.interface'
import { IBalance } from './extended-balance.interface'

export interface IWalletState extends IWallet, IPersistedWalletData {
    id: string
    depositAddress: string
    balances: IBalance
    isTransferring: boolean
    hasVotingPowerTransactionInProgress: boolean
    hasVotingTransactionInProgress: boolean
    hasConsolidatingOutputsTransactionInProgress: boolean
    hasImplicitAccountCreationTransactionInProgress: boolean
    isImplicitAccountCreationStarted: boolean
    hasDelegationTransactionInProgress: boolean
    votingPower: string
    walletOutputs: OutputData[]
    walletUnspentOutputs: OutputData[]
    accountOutputs: OutputData[]
    implicitAccountOutputs: OutputData[]
}
