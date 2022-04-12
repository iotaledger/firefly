import { Unit } from '@iota/unit-converter'
import { LabeledWalletAccount } from './wallet'

export interface SendParams {
    amount: string | undefined
    unit?: Unit
    address: string
    message: string
    isInternal: boolean
    toWalletAccount?: LabeledWalletAccount
}
