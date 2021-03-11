import { AvailableExchangeRates } from 'shared/lib/currency'
import { persistent } from 'shared/lib/helpers'
import { DEFAULT_NODE } from 'shared/lib/network'
import { generateRandomId } from 'shared/lib/utils'
import { derived, get, Readable, writable } from 'svelte/store'
import { Electron } from './electron'
import type { Node } from './typings/client'

/**
 * Base profile interface —
 */
interface BaseProfile {
    name: string
    id: string
    active: boolean
}

/**
 * Extended profile interface (Extra properties associated with a profile)
 */
interface ExtendedProfile {
    /**
     * Determines if stronghold is locked
     */
    isStrongholdLocked: boolean
    /**
     * Time for most recent stronghold back up
     */
    lastStrongholdBackupTime: Date | null
    /**
     * User settings
     */
    settings: UserSettings
}

/**
 * User Settings
 */
export interface UserSettings {
    deepLinking: boolean
    outsourcePow: boolean
    language: string
    currency: AvailableExchangeRates
    notifications: boolean
    node: Node
    customNodes: Node[]
    /** Lock screen timeout in minutes */
    lockScreenTimeout: number
    automaticNodeSelection: boolean
}

/**
 * Profile interface
 */
interface Profile extends BaseProfile, ExtendedProfile {
    isDeveloperProfile: boolean
}

export const profiles = persistent<Profile[]>('profiles', [])

export const newProfile = writable<Profile | null>(null)

/**
 * Currently active profile
 */
export const activeProfile: Readable<Profile | undefined> = derived(
    [profiles, newProfile],
    ([$profiles, $newProfile]) =>
        $newProfile ||
        $profiles.find((_profile) => {
            return _profile.active === true
        })
)

activeProfile.subscribe((profile) => {
    Electron.updateActiveProfile(profile ? profile.id : null)
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
    const profile = {
        id: generateRandomId(),
        name: profileName,
        active: true,
        isStrongholdLocked: true,
        lastStrongholdBackupTime: null,
        isDeveloperProfile,
        // Settings
        settings: {
            deepLinking: false,
            language: 'en',
            outsourcePow: false,
            currency: AvailableExchangeRates.USD,
            notifications: true,
            node: DEFAULT_NODE,
            customNodes: [],
            // Minutes
            lockScreenTimeout: 5,
            automaticNodeSelection: true,
        },
    }

    newProfile.set(profile)

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
    newProfile.set(null)
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
    profiles.update((_profiles) => _profiles.map((profile) => Object.assign({}, profile, { active: id === profile.id })))
}



/**
 * Clears the active profile
 *
 * @method clearActiveProfile
 *
 * @returns {void}
 */
export const clearActiveProfile = (): void => {
    profiles.update((_profiles) => _profiles.map((profile) => Object.assign({}, profile, { active: false })))
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

        pathList.reduce((a, b: keyof ExtendedProfile | keyof UserSettings, level: number) => {
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
