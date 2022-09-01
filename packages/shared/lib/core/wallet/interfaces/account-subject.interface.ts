import { IAccountState } from '@core/account'

export interface IAccountSubject {
    type: 'account'
    account: IAccountState
}
