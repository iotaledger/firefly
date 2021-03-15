import { AvailableExchangeRates } from 'shared/lib/currency'
import { persistent } from 'shared/lib/helpers'
import { DEFAULT_NODE } from 'shared/lib/network'
import { generateRandomId } from 'shared/lib/utils'
import { api } from 'shared/lib/wallet'
import { derived, get, Readable, writable } from 'svelte/store'
import { Electron } from './electron'
import type { Node } from './typings/client'

/**
 * Profile
 */
interface Profile {
    id: string
    name: string
    /**
     * Time for most recent stronghold back up
     */
    lastStrongholdBackupTime: Date | null
    /**
     * User settings
     */
    settings: UserSettings
    isDeveloperProfile: boolean

}

/**
 * User Settings
 */
export interface UserSettings {
    outsourcePow: boolean
    currency: AvailableExchangeRates
    automaticNodeSelection: boolean
    node: Node
    customNodes: Node[]
    /** Lock screen timeout in minutes */
    lockScreenTimeout: number
}

export const activeProfileId = writable<string | null>(null)

export const profiles = persistent<Profile[]>('profiles', [])

export const newProfile = writable<Profile | null>(null)

export const isProfileStrongholdLocked = writable<boolean>(true)

/**
 * Currently active profile
 */
export const activeProfile: Readable<Profile | undefined> = derived(
    [profiles, newProfile, activeProfileId],
    ([$profiles, $newProfile, $activeProfileId]) =>
        $newProfile ||
        $profiles.find((_profile) => {
            return _profile.id === $activeProfileId
        })
)

activeProfileId.subscribe((profileId) => {
    Electron.updateActiveProfile(profileId)
})

/**
 * Saves profile in persistent storage
 *
 * @method saveProfile
 *
 * @param {Profile} profile
 *
 * @returns {Profile}
 */
export const saveProfile = (profile: Profile): Profile => {
    profiles.update((_profiles) => {
        return [..._profiles, profile]
    })

    return profile
}

/**
 * Creates a new profile
 *
 * @method createProfile
 *
 * @returns {Profile}
 */
export const createProfile = (profileName, isDeveloperProfile): Profile => {
    const profile: Profile = {
        id: generateRandomId(),
        name: profileName,
        lastStrongholdBackupTime: null,
        isDeveloperProfile,
        settings: {
            outsourcePow: false,
            currency: AvailableExchangeRates.USD,
            automaticNodeSelection: true,
            node: DEFAULT_NODE,
            customNodes: [],
            // Minutes
            lockScreenTimeout: 5,
        },
    }

    newProfile.set(profile)
    activeProfileId.set(profile.id)

    return profile
}

/**
 * Disposes a new profile
 *
 * @method disposeNewProfile
 *
 * @returns {void}
 */
export const disposeNewProfile = (): void => {
    const np = get(newProfile)
    if (np) {
        api.removeStorage({
            onSuccess() {
                api.removeAccount(np.id, {
                    onSuccess() {
                    },
                    onError(err) {
                        console.error(err)
                    },
                })
            },
            onError(err) {
                console.error(err)
            },
        })
    }
    newProfile.set(null)
    activeProfileId.set(null)
}

/**
 * Sets profile with provided id as active
 *
 * @method setActiveProfile
 *
 * @param {string} id
 *
 * @returns {void}
 */
export const setActiveProfile = (id: string): void => {
    activeProfileId.set(id)
}

/**
 * Clears the active profile
 *
 * @method clearActiveProfile
 *
 * @returns {void}
 */
export const clearActiveProfile = (): void => {
    activeProfileId.set(null)
}

/**
 * Removes profile from storage
 *
 * @method removeProfile
 *
 * @param {string} id
 *
 * @returns {void}
 */
export const removeProfile = (id: string): void => {
    profiles.update((_profiles) => {
        return _profiles.filter((_profile) => _profile.id !== id)
    })
}

/**
 * Updates a profile property
 *
 * @method UpdateProfile
 *
 * @param {string} id
 *
 * @returns {void}
 */
export const updateProfile = (
    path: string, value: string | boolean | Date | AvailableExchangeRates | Node | Node[]) => {
    const _update = (_profile) => {
        const pathList = path.split('.')

        pathList.reduce((a, b: keyof Profile | keyof UserSettings, level: number) => {
            if (level === pathList.length - 1) {
                a[b] = value
                return value
            }
            return a[b]
        }, _profile)

        return _profile
    }

    if (get(newProfile)) {
        newProfile.update((_profile) => _update(_profile))
    } else {
        profiles.update((_profiles) => {
            return _profiles.map((_profile) => {
                if (_profile.id === get(activeProfile)?.id) {
                    return _update(_profile)
                }

                return _profile
            })
        })
    }
}
