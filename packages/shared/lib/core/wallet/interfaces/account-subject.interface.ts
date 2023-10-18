import { IAccountState } from '@core/account'
import { SubjectType } from '../enums'

export interface IAccountSubject {
    type: SubjectType.Account
    account: IAccountState
}
