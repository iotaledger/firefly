import { CreateAccountPayload } from '@iota/wallet'
import { StardustAccount } from '@lib/typings/account'
import { get } from 'svelte/store'
import { profileManager } from '../store'

export function createStardustAccount(payload: CreateAccountPayload): Promise<StardustAccount> {
    const manager = get(profileManager)
    return manager.createAccount(payload)
}
