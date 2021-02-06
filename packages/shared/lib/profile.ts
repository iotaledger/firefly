import { get, derived, writable } from 'svelte/store'
import { persistent } from 'shared/lib/helpers'
import { generateRandomId } from 'shared/lib/utils'
import { AvailableExchangeRates } from 'shared/lib/currency'

/**
 * Base profile interface — 
 */
interface BaseProfile {
    name: string;
    id: string;
    active: boolean;
}

/**
 * Extended profile interface (Extra properties associated with a profile)
 */
interface ExtendedProfile {
    /**
     * Determines if stronghold is locked
     */
    isStrongholdLocked: boolean;
    /**
     * Time for most recent stronghold back up
     */
    lastStrongholdBackupTime: Date | null;
    /**
     * User settings
     */
    settings: UserSettings
}

/**
 * User Settings
 */
export interface UserSettings {
    deepLinking: boolean,
    developerMode: boolean,
    outsourcePow: boolean,
    language: string,
    currency: AvailableExchangeRates,
    notifications: boolean,
    /** Lock screen timeout in minutes */
    lockScreenTimeout: number
}

/**
 * Profile interface
 */
interface Profile extends BaseProfile, ExtendedProfile { }

export const profiles = persistent<Profile[]>('profiles', []);

export const newProfile = writable<Profile | null>(null);

/**
 * Profile interface
 */
interface Profile extends BaseProfile, ExtendedProfile { }

/**
 * Currently active profile
 */
export const activeProfile = derived([profiles, newProfile], ([$profiles, $newProfile]) =>
    $newProfile || $profiles.find((_profile) => {
        return _profile.active === true
    })
)

/**
 * Creates a new profile
 * 
 * @method createProfile
 * 
 * @returns {Profile}
 */
export const createProfile = (profileName): Profile => {
    if (get(profiles).some((profile) => profile.name === profileName)) {
        throw new Error(`Profile with name ${profileName} already exists.`);
    }

    const profile = {
        id: generateRandomId(),
        name: profileName,
        active: true,
        isStrongholdLocked: true,
        lastStrongholdBackupTime: null,
        // Settings
        settings: {
            deepLinking: false,
            language: 'en',
            developerMode: false,
            outsourcePow: false,
            currency: AvailableExchangeRates.USD,
            notifications: true,
            // Minutes
            lockScreenTimeout: 5
        }
    };

    newProfile.set(profile)

    return profile;
};

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
        return [
            ..._profiles,
            profile
        ]
    })

    return profile;
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
export const updateProfile = (path: string, value: string | boolean | Date | AvailableExchangeRates) => {
    const _update = (_profile) => {
        const pathList = path.split('.')

        pathList.reduce((a, b: keyof ExtendedProfile | keyof UserSettings, level: number) => {
            if (level === pathList.length - 1) {
                a[b] = value;
                return value;
            }
            return a[b];
        }, _profile)

        return _profile
    };

    if (get(newProfile)) {
        newProfile.update((_profile) => _update(_profile))
    } else {
        profiles.update((_profiles) => {
            return _profiles.map((_profile) => {
                if (_profile.id === get(activeProfile).id) {
                    return _update(_profile);
                }

                return _profile
            })
        })
    }
}
