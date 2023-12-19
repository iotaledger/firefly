import { IWalletState } from '@core/wallet/interfaces'
import { SubjectType } from '../enums'

export interface IWalletSubject {
    type: SubjectType.Wallet
    wallet: IWalletState
}
