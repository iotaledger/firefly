import { persistent } from '@lib/helpers'
import { IClaimedActivities } from '../interfaces'

export const claimedActivities = persistent<IClaimedActivities[]>('claimedActivities', [])

export function addClaimedActivity(
    accountId: string,
    transactionId: string,
    claimedActivity: IClaimedActivities
): void {
    claimedActivities.update((state) => {
        if (!state[accountId]) {
            state[accountId] = {}
        }
        state[accountId][transactionId] = claimedActivity
        return state
    })
}
