import { persistent } from '@lib/helpers'
import { IPersistedProfile } from '../interfaces'

export const profiles = persistent<IPersistedProfile[]>('profiles', [])

/**
 * Adds a new profile to persistent storage
 * @method addProfile
 * @param {IPersistedProfile} newProfile
 * @returns {void}
 */
export function addProfile(newProfile: IPersistedProfile): void {
    profiles.update((state) => [...state, newProfile])
}

/**
 * Saves profile in persistent storage
 * @method saveProfile
 * @param {IPersistedProfile} profileToPersist
 * @returns {void}
 */
export function saveProfile(profileToPersist: IPersistedProfile): void {
    profiles.update((state) => {
        const updatedState = state.map((profile) => (profile.id === profileToPersist.id ? profileToPersist : profile))
        if (!updatedState.includes(profileToPersist)) {
            updatedState.push(profileToPersist)
        }
        return updatedState
    })
}

/**
 * Removes a profile from persistent storage
 *
 * @method removeProfile
 * @param {string} id
 * @returns {void}
 */
export const removeProfile = (id: string): void => {
    profiles.update((state) => state.filter((profile) => profile.id !== id))
}
