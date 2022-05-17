import { IAccount } from '@core/account'
import { api } from './api'

export function getAccount(index: number): Promise<IAccount> {
    return api.getAccount(index)
}
