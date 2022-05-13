import { IAccountState } from '@core/account'
import { Unit } from '@iota/unit-converter'

export interface SendParams {
    amount: string | undefined
    unit?: Unit
    address: string
    message: string
    isInternal: boolean
    toWalletAccount?: IAccountState
}
