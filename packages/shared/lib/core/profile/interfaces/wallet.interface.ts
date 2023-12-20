import { Wallet } from '@iota/sdk'

// TODO(2.0): rename to IWallet & check all functions in this interface to make sure they still exist
export interface IWallet extends Wallet {
    id: string
}
