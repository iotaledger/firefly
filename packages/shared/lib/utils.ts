export const VALID_MAINNET_ADDRESS = /^iota1[02-9ac-hj-np-z]{59}$/
export const VALID_DEVNET_ADDRESS = /^atoi1[02-9ac-hj-np-z]{59}$/

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

/**
 * Parse a deep link (iota://)
 * @param  {string} data Deep link data
 * @return {ParsedURL}  The parsed address, message and/or amount values
 */
export const parseDeepLink = (data) => {
    const parsed = parseAddress(data);
    if (!parsed) {
        return null;
    }

    return {
        address: parsed.address,
        message: parsed.message || '',
        amount: parsed.amount ? parsed.amount.toString() : '0',
    };
};

/** Parse an IOTA address input
 * @param {string} input
 * @returns {ParsedURL} - The parsed address, message and/or amount values
 */
export const parseAddress = (input) => {
    const result = {
        address: null,
        message: null,
        amount: null,
    };

    if (!input || typeof input !== 'string') {
        return null;
    }

    if (input.match(VALID_MAINNET_ADDRESS)) {
        result.address = input;
        return result;
    }

    try {
        let parsed = {
            address: null,
            message: null,
            amount: null,
        };

        if (input.toLowerCase().indexOf('iota:') === 0) {
            const url = new URL(input);
            parsed.address = url.hostname.toLowerCase();
            parsed.message = url.searchParams.get('message');
            parsed.amount = url.searchParams.get('amount');
        } else {
            parsed = JSON.parse(input);
        }

        if (parsed.address.match(VALID_MAINNET_ADDRESS)) {
            result.address = parsed.address;
        } else {
            return null;
        }
        
        if (parsed.message && typeof parsed.message === 'string') {
            result.message = parsed.message;
        }

        if (parsed.amount && String(parsed.amount) === String(parseInt(parsed.amount, 10))) {
            result.amount = Math.abs(parseInt(parsed.amount, 10));
        }
    } catch (error) {
        return null;
    }

    return result;
};