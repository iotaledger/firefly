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

/**
 * Validate pincode format
 */
export const validatePinFormat = (pincode: string) => {
    const REGEX = /^\d{6}$/
    return REGEX.test(pincode)
}

/**
 * @method generateRandomId
 *
 * @returns {string}
 */
export const generateRandomId = (): string => {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => {
        return ('0' + (byte & 0xff).toString(16)).slice(-2)
    }).join('')
}