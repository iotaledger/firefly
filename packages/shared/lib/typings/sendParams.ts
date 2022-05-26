import { IAccountState } from '@core/account'
import { Unit } from '@lib/units'

export interface SendParams {
    amount: string | undefined
    unit?: Unit
    address: string
    message: string
    isInternal: boolean
    toWalletAccount?: IAccountState
}
