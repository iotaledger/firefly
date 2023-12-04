import { IWalletState } from '@core/wallet/interfaces'
import { SubjectType } from '../enums'

export interface IAccountSubject {
    type: SubjectType.Account
    account: IWalletState
}
