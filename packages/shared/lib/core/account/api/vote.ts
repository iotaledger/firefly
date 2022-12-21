import { Transaction } from '@iota/wallet'

import { getAccount } from '@core/profile-manager/api'

export async function vote(index?: number, eventId?: string, answers?: number[]): Promise<Transaction> {
    return (await getAccount(index))?.vote(eventId, answers)
}
