import { Transaction } from '@iota/wallet'

import { getAccount } from '@core/profile-manager/api'

export async function vote(accountIndex: number, eventId?: string, answers?: number[]): Promise<Transaction> {
    return (await getAccount(accountIndex))?.vote(eventId, answers)
}
