import { Unit } from '@iota/unit-converter';
import { Electron } from 'shared/lib/electron';
import { addError } from 'shared/lib/errors';
import { localize } from 'shared/lib/i18n';
import { showAppNotification } from 'shared/lib/notifications';
import validUrl from 'valid-url';

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
 * Parse a deep link for the app (iota://)
 * @param  {string} data Deep link data
 * @return {ParsedURL}  The parsed address, message and/or amount values
 */
export const parseDeepLink = (addressPrefix, input) => {
    if (!input || typeof input !== "string") {
        return
    }

    try {
        const url = new URL(input)

        if (url.protocol === "iota:") {
            if (url.host === "wallet") {
                // Remove any leading and trailing slashes
                const pathParts = url.pathname.replace(/^\/+|\/+$/g, '').split("/")

                if (pathParts.length === 0) {
                    addError({ time: Date.now(), type: "deepLink", message: `No op part in the url path` })
                    return
                }

                if (pathParts[0] === "send") {
                    return parseWalletSendDeepLink(addressPrefix, url, pathParts.slice(1))
                }

                addError({ time: Date.now(), type: "deepLink", message: `Unrecognized wallet action '${pathParts[0]}'` })
            } else {
                addError({ time: Date.now(), type: "deepLink", message: `Unrecognized context '${url.host}'` })
            }
        } else {
            addError({ time: Date.now(), type: "deepLink", message: `Error handling deep link. Does not start with iota://` })
        }
    } catch (err) {
        addError({ time: Date.now(), type: "deepLink", message: `Error handling deep link. ${err.message}` })
    }
}

/**
 * Parse a deep link for the wallet (iota://wallet/send)
 * @param  {url} The url
 * @param  {pathParts} The path parts
 * @return {ParsedURL}  The parsed address, message and/or amount values
 */
export const parseWalletSendDeepLink = (addressPrefix, url, pathParts) => {
    if (pathParts.length === 0) {
        addError({ time: Date.now(), type: "deepLink", message: `No address part in the url path` })
        return
    }

    // Path starts with '/' so ignore the first one
    const address = pathParts[0]

    if (!new RegExp(`^${addressPrefix}1[02-9ac-hj-np-z]{59}$`).test(address)) {
        addError({ time: Date.now(), type: "deepLink", message: `Address '${address}' does not match prefix '${addressPrefix}' or format` })
        return
    }

    const amountParam = url.searchParams.get('amt')
    const parsedAmount = Number.parseFloat(amountParam)
    if (Number.isNaN(parsedAmount) || !Number.isFinite(parsedAmount)) {
        addError({ time: Date.now(), type: "deepLink", message: `Amount is not a number '${amountParam}'` })
        return
    }

    const unitParam: Unit = url.searchParams.get('unit') as Unit ?? Unit.i
    if (!Object.values(Unit).includes(unitParam)) {
        addError({ time: Date.now(), type: "deepLink", message: `Unit is not recognised '${unitParam}'` })
    }

    if (unitParam === "i" && !Number.isInteger(parsedAmount)) {
        addError({ time: Date.now(), type: "deepLink", message: `For unit 'i' the amount must be an integer '${parsedAmount}'` })
        return
    }

    return {
        context: "wallet",
        operation: "send",
        params: {
            address,
            amount: Math.abs(parsedAmount),
            unit: unitParam,
            message: url.searchParams.get('msg') ?? ''
        }
    }
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
 * @returns The error string to use if it does not validate.
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