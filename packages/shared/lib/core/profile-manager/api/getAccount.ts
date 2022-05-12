import { StardustAccount } from '@lib/typings/account'
import { api } from './api'

export function getAccount(index: number): Promise<StardustAccount> {
    return api.getAccount(index)
}
