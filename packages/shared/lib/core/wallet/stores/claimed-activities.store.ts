import { activeProfileId } from '@core/profile'
import { persistent } from '@lib/helpers'
import { get } from 'svelte/store'
import { IClaimedActivities, IClaimedActivitiesPerProfile } from '../interfaces'

export const claimedActivities = persistent<IClaimedActivitiesPerProfile>('claimedActivities', {})

export function addClaimedActivity(
    accountIndex: number,
    transactionId: string,
    claimedActivity: IClaimedActivities
): void {
    claimedActivities.update((state) => {
        const profileId = get(activeProfileId)
        if (Array.isArray(state)) {
            // needed because of legacy way to store claimed activities
            state = {}
        }
        if (!state[profileId]) {
            state[profileId] = {}
        }
        if (!state[profileId][accountIndex]) {
            state[profileId][accountIndex] = {}
        }
        state[profileId][accountIndex][transactionId] = claimedActivity
        return state
    })
}
