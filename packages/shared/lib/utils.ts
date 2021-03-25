import { Electron } from 'shared/lib/electron'
import { localize } from 'shared/lib/i18n'
import { showAppNotification } from 'shared/lib/notifications'
import validUrl from 'valid-url'

export const VALID_MAINNET_ADDRESS = /^iota1[02-9ac-hj-np-z]{59}$/
export const VALID_DEVNET_ADDRESS = /^atoi1[02-9ac-hj-np-z]{59}$/
export const ADDRESS_LENGTH = 64;
export const PIN_LENGTH = 6;

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
 * Validate pincode format
 */
export const validatePinFormat = (pincode: string) => {
    const REGEX = new RegExp(`^\\d{${PIN_LENGTH}}$`)
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
    const parsed = parseAddress(data)
    if (!parsed) {
        return null
    }

    return {
        address: parsed.address,
        message: parsed.message || '',
        amount: parsed.amount ? parsed.amount.toString() : '0',
    }
}

/** Parse an IOTA address input
 * @param {string} input
 * @returns {ParsedURL} - The parsed address, message and/or amount values
 */
export const parseAddress = (input) => {
    const result = {
        address: null,
        message: null,
        amount: null,
    }

    if (!input || typeof input !== 'string') {
        return null
    }

    if (input.match(VALID_MAINNET_ADDRESS) || input.match(VALID_DEVNET_ADDRESS)) {
        result.address = input
        return result
    }

    try {
        let parsed = {
            address: null,
            message: null,
            amount: null,
        }

        if (input.toLowerCase().indexOf('iota:') === 0) {
            const url = new URL(input)
            parsed.address = url.hostname.toLowerCase()
            parsed.message = url.searchParams.get('message')
            parsed.amount = url.searchParams.get('amount')
        } else {
            parsed = JSON.parse(input)
        }

        if (parsed.address.match(VALID_MAINNET_ADDRESS) || parsed.address.match(VALID_DEVNET_ADDRESS)) {
            result.address = parsed.address
        } else {
            return null
        }

        if (parsed.message && typeof parsed.message === 'string') {
            result.message = parsed.message
        }

        if (parsed.amount && String(parsed.amount) === String(parseInt(parsed.amount, 10))) {
            result.amount = Math.abs(parseInt(parsed.amount, 10))
        }
    } catch (error) {
        return null
    }

    return result
}

/**
 * Checks if a URL is valid
 * @method isValidUrl
 *
 * @param  {string}  url
 * @returns {Boolean}
 */
export const isValidUrl = (url) => {
    if (validUrl.isWebUri(url)) {
        return true
    }
    return false
}

/**
 * Check if a URL uses HTTPS
 *
 * @method isValidHttpsUrl
 *
 * @param  {string}  url
 * @returns {Boolean}
 */
export const isValidHttpsUrl = (url) => {
    if (validUrl.isHttpsUri(url)) {
        return true
    }
    return false
}

/**
 * Validate an address given its prefix.
 * @param prefix The bech32 hrp prefix to match.
 * @param addr The address to validate.
 * @returns True if it matches the bech32 format.
 */
export const validateBech32Address = (prefix, addr) => {
    if (!addr || !addr.startsWith(prefix)) {
        return localize('error.send.wrongAddressPrefix', {
            values: {
                prefix: prefix,
            },
        })
    }
    if (!new RegExp(`^${prefix}1[02-9ac-hj-np-z]{59}$`).test(addr)) {
        return localize('error.send.wrongAddressFormat')
    }
}

/**
 * Debounce the opertation
 * @param callback The callback to call in completion
 * @param wait How to long wait before calling callback
 */
export function debounce(callback, wait = 500) {
    let _timeout
    return (...args) => {
        const context = this
        clearTimeout(_timeout)
        _timeout = setTimeout(() => callback.apply(context, args), wait)
    }
}

/**
 * Set text to clipboard
 */
export const setClipboard = (input: string): boolean => {
    try {
        const textArea = document.createElement('textarea')
        textArea.value = input
        document.body.appendChild(textArea)

        if (navigator.userAgent.match(/ipad|iphone/i)) {
            const range = document.createRange()
            range.selectNodeContents(textArea)
            const selection = window.getSelection()
            selection.removeAllRanges()
            selection.addRange(range)
            textArea.setSelectionRange(0, 999999)
        } else {
            textArea.select()
        }

        document.execCommand('copy')
        document.body.removeChild(textArea)

        const notificationMessage = localize('notifications.copiedToClipboard')
        showAppNotification({ type: "info", message: notificationMessage })

        return true
    } catch (err) {
        console.log(err)
        return false
    }
}

export const getDefaultStrongholdName = (): string => {
    // Match https://github.com/iotaledger/wallet.rs/blob/ffbeaa3466b44f79dd5f87e14ed1bdc4846d9e85/src/account_manager.rs#L1428
    // Trim milliseconds and replace colons with dashes
    const date = new Date().toISOString().slice(0, -5).replace(/:/g, "-")
    return `firefly-backup-${date}.stronghold`
}

export const downloadRecoveryKit = () => {
    fetch('assets/docs/recovery-kit.pdf')
        .then((response) => response.arrayBuffer())
        .then((data) => {
            Electron.saveRecoveryKit(data)
        })
        .catch((err) => {
            console.error(err)
        })
}