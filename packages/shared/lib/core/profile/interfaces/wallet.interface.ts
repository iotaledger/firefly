import { Wallet } from '@iota/sdk'

export interface IWallet extends Wallet {
    id: string
}
