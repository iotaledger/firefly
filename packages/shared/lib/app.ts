import { get, writable, derived } from 'svelte/store'
import { persistent } from 'shared/lib/helpers'
import { generateRandomId } from 'shared/lib/utils'

/**
 * Notification content
 */
export const notification = writable<string>(null)

/**
 * Mobile mode
 */
export const mobile = writable<boolean>(false)

/**
 * Dark mode enabled state
 */
export const darkMode = persistent<boolean>('darkMode', false)

/**
 * Wallet access pin
 */
export const walletPin = persistent<number>('walletPin', null)

/**
 * Stronghold password
 */
export const strongholdPassword = writable<string>(null)

/**
 * Seed BIP39 mnemonic recovery phrase
 */
export const mnemonic = writable<Array<string>>(null)

interface SendParams {
    amount: number;
    address: string;
    message: string;
}

/**
 * Input paramaters for sending transactions
 */
export const sendParams = writable<SendParams>({ amount: 0, address: '', message: '' })

/**
 * Dummy
 */
export const logged = persistent<boolean>('logged', false)

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
    strongholdLastBackupTime: Date | null;
}

/**
 * Profile interface
 */
interface Profile extends BaseProfile, ExtendedProfile { }

export const profiles = persistent<Profile[]>('profiles', []);

/**
 * Gets active profile
 * 
 * @method getActiveProfile
 * 
 * @returns {Profile}
 */
export const getActiveProfile = (): Profile => {
    return get(profiles).find((_profile) => {
        return _profile.active === true
    });
}

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
        // At the time of profile creation, stronghold will be locked
        isStrongholdLocked: true,
        strongholdLastBackupTime: null
    };

    profiles.update((_profiles) => {
        return [
            ..._profiles,
            profile
        ]
    })

    return profile;
};

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
 * Updates stronghold status
 * 
 * @method updateStrongholdStatus
 * 
 * @param {boolean} status - Locked / Unlocked
 * 
 * @returns {void} 
 */
export const updateStrongholdStatus = (status: boolean): void => {
    profiles.update((_profiles) => {
        return _profiles.map((_profile) => {
            if (_profile.id === getActiveProfile().id) {
                return Object.assign({}, _profile, {
                    isStrongholdLocked: status
                })
            }

            return _profile
        })
    })
}

/**
 * Updates stronghold backup time
 * 
 * @method updateStrongholdBackupTime
 * 
 * @param {Date} time
 * 
 * @returns {void} 
 */
export const updateStrongholdBackupTime = (time: Date): void => {
    profiles.update((_profiles) => {
        return _profiles.map((_profile) => {
            if (_profile.id === getActiveProfile().id) {
                return Object.assign({}, _profile, {
                    strongholdLastBackupTime: time
                })
            }

            return _profile
        })
    })
}
