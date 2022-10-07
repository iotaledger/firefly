import { persistent } from '@lib/helpers'
import { IClaimedActivities, IClaimedActivitiesPerAccount } from '../interfaces'

export const claimedActivities = persistent<IClaimedActivitiesPerAccount[]>('claimedActivities', [])

export function addClaimedActivity(
    accountIndex: number,
    transactionId: string,
    claimedActivity: IClaimedActivities
): void {
    claimedActivities.update((state) => {
        if (!state[accountIndex]) {
            state[accountIndex] = { accountIndex, activities: undefined }
        }
        state[accountIndex][transactionId] = claimedActivity
        return state
    })
}
