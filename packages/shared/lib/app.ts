import { get, writable } from 'svelte/store'
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

/**
 * App language
 */
export const locale = persistent<string>('locale', null)


interface SendParams {
    amount: number;
    address: string;
    message: string;
}

/**
 * Input paramaters for sending transactions
 */
export const sendParams = writable<SendParams>({ amount: 0, address: '', message: ''})

/**
 * Dummy
 */
export const logged = persistent<boolean>('logged', false)

interface Profile {
    name: string;
    id: string;
    active: boolean;
}

export const profiles = persistent<Profile[]>('profiles', []);

export const getActiveProfile = (): Profile => {
    return get(profiles).find((_profile) => {
        return _profile.active === true
    });
}

export const createProfile = (profileName): Profile => {
    if (get(profiles).some((profile) => profile.name === profileName)) {
        throw new Error(`Profile with name ${profileName} already exists.`);
    }

    const profile = {
        id: generateRandomId(),
        name: profileName,
        active: true
    };

    profiles.update((_profiles) => {
        return [
            ..._profiles,
            profile
        ]
    })

    return profile;
};

export const setActiveProfile = (id) => {
    profiles.update((_profiles) => _profiles.map((profile) => Object.assign({}, profile, { active: id === profile.id })))
}
