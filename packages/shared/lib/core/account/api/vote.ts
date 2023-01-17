import { get } from 'svelte/store'
import { Transaction } from '@iota/wallet'

import { getAccount } from '@core/profile-manager/api'
import { selectedAccountIndex } from '@core/account/stores'

export async function vote(eventId?: string, answers?: number[]): Promise<Transaction> {
    return (await getAccount(get(selectedAccountIndex)))?.vote(eventId, answers)
}
