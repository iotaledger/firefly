import { get } from 'svelte/store'

import { activeProfileId } from '@core/profile'
import { persistent } from '@core/utils/store'

import { IClaimedActivities, IClaimedActivitiesPerProfile } from '../interfaces'

export const claimedActivities = persistent<IClaimedActivitiesPerProfile>('claimedActivities', {})

export function addClaimedActivity(
    walletId: string,
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
        if (!state[profileId][walletId]) {
            state[profileId][walletId] = {}
        }
        state[profileId][walletId][transactionId] = claimedActivity
        return state
    })
}
