import { generateMnemonic } from 'bip39'
import { api } from 'shared/lib/wallet';

export function bindEvents(element, events) {
    const listeners = Object.entries(events).map(([event, handler]) => {
        const listener = element.addEventListener(event, handler)

        return [event, listener]
    })

    return {
        destroy() {
            listeners.forEach(([event, listener]) => {
                element.removeEventListener(event, listener)
            })
        },
    }
}

/**
 * Generate BIP39 Mnemonic Recovery Phrase
 */
export const generateRecoveryPhrase = (): Promise<string[]> => new Promise((resolve, reject) => {
    api.generateMnemonic({
        onSuccess(response) { resolve(response.payload.split(' ')) },
        onError(error) { reject(error) }
    })
})

/**
 * Validate seed format
 */

export const validateSeed = (seed) => {
    const REGEX = /^[a-z0-9]+$/i
    const SEED_LENGTH = 81
    return REGEX.test(seed) && seed.length == SEED_LENGTH
}

/**
 * Validate recovery phrase format
 */
export const validateRecoveryPhrase = (phrase) => {
    const RECOVERY_PHRASE_LENGTH = 24
    const REGEX = /^[a-zA-Z ]*$/
    return REGEX.test(phrase) && phrase.match(/\b(\w+)\b/g)?.length == RECOVERY_PHRASE_LENGTH
}

export const verifyRecoveryPhrase = (phrase): Promise<void> => new Promise((resolve, reject) => {
    api.verifyMnemonic(phrase, {
        onSuccess(response) {
            resolve(response)
        },
        onError(error) { reject(error) }
    })
})

/**
 * Validate pincode format
 */
export const validatePinFormat = (pincode: string) => {
    const REGEX = /^\d{6}$/
    return REGEX.test(pincode)
}
