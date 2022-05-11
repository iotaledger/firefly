import { persistent } from '@lib/helpers'
import { IPersistedProfile } from '../interfaces'

export const profiles = persistent<IPersistedProfile[]>('profiles', [])

/**
 * Saves profile in persistent storage
 * @method saveProfile
 * @param {IPersistedProfile} profileToPersist
 * @returns {void}
 */
export function saveProfile(profileToPersist: IPersistedProfile): void {
    // todo make it save the new ones too?
    return profiles.update((state) => {
        const updatedState = state.map((profile) => (profile.id === profileToPersist.id ? profileToPersist : profile))
        if (!updatedState.includes(profileToPersist)) {
            updatedState.push(profileToPersist)
        }
        return updatedState
    })
}
