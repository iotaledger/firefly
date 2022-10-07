import { persistent } from '@lib/helpers'
import { IClaimedActivities } from '../interfaces'

export const claimedActivities = persistent<IClaimedActivities[]>('claimedActivities', [])

export function addClaimedActivity(
    accountIndex: number,
    transactionId: string,
    claimedActivity: IClaimedActivities
): void {
    claimedActivities.update((state) => {
        if (!state[accountIndex]) {
            state[accountIndex] = null
        }
        state[accountIndex][transactionId] = claimedActivity
        return state
    })
}
