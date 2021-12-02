import { Bech32 } from 'shared/lib/bech32'
import { Platform } from 'shared/lib/platform'
import { localize } from 'shared/lib/i18n'
import { showAppNotification } from 'shared/lib/notifications'
import validUrl from 'valid-url'
import type { Event } from './typings/events'

export const ADDRESS_LENGTH = 64
export const PIN_LENGTH = 6

interface Element {
    addEventListener(event: Event<unknown> | string, unknown)
    removeEventListener(event: Event<unknown> | string, handler: unknown)
}

export function bindEvents(element: Element, events: Event<unknown>[]): { destroy } {
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
export const validatePinFormat = (pincode: string): boolean => {
    const REGEX = new RegExp(`^\\d{${PIN_LENGTH}}$`)
    return REGEX.test(pincode)
}

/**
 * @method generateRandomId
 *
 * @returns {string}
 */
export const generateRandomId = (): string =>
    Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => ('0' + (byte & 0xff).toString(16)).slice(-2)).join(
        ''
    )

/**
 * Checks if a URL is valid
 * @method isValidUrl
 *
 * @param {string}  url
 * @returns {Boolean}
 */
export const isValidUrl = (url: string): boolean => {
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
export const isValidHttpsUrl = (url: string): boolean => {
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
export const validateBech32Address = (prefix: string, addr: string): undefined | string => {
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

    let isValid = false
    try {
        const decoded = Bech32.decode(addr)
        isValid = decoded && decoded.humanReadablePart === prefix
    } catch (err) {
        console.error('error.crypto.cannotDecodeBech32')
    }

    if (!isValid) {
        return localize('error.send.invalidAddress')
    }
}

/**
 * Debounce the operation
 * @param callback Callback to execute after debouncing
 * @param wait Length of time (millis) before executing the callback
 */
export function debounce(callback: () => void, wait = 500): (...args: unknown[]) => void {
    let _timeout
    return (...args) => {
        /* eslint-disable @typescript-eslint/no-this-alias */
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

        if (/ipad|iphone/i.exec(navigator.userAgent)) {
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
        showAppNotification({ type: 'info', message: notificationMessage })

        return true
    } catch (err) {
        console.error(err)

        return false
    }
}

export const getDefaultStrongholdName = (): string => {
    // Match https://github.com/iotaledger/wallet.rs/blob/ffbeaa3466b44f79dd5f87e14ed1bdc4846d9e85/src/account_manager.rs#L1428
    // Trim milliseconds and replace colons with dashes
    const tzoffset = new Date().getTimezoneOffset() * 60000 // offset in milliseconds
    const localISOTime = new Date(Date.now() - tzoffset).toISOString()
    const date = localISOTime.slice(0, -5).replace(/:/g, '-')
    return `firefly-backup-${date}.stronghold`
}

export const downloadRecoveryKit = (): void => {
    fetch('assets/docs/recovery-kit.pdf')
        .then((response) => response.arrayBuffer())
        .then((data) => {
            void Platform.saveRecoveryKit(data)
        })
        .catch((err) => {
            console.error(err)
        })
}

/**
 * Migrates an object to a newer version keeping old data if it already exists and
 * adds new data if the property doesn't exist.
 *
 * @param oldObj The object whose keys and data will be used if found and matching the newer version
 * @param newObj The object whose keys and data will be used if not found on older version
 *
 * @returns The resulting object of migrating from an older version to a newer one (i.e. updated keys and / or data)
 */
export const migrateObjects = <T>(oldObj: T, newObj: T): T => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const _helper = (curObj: any, oldObj: any, newObj: any): any => {
        // Iterate through each key of a new object...
        for (const k in newObj) {
            // If key also exists in old object then...
            if (k in oldObj) {
                // If corresponding value in the new object is also an object and is not undefined or null then...
                if (typeof newObj[k] === 'object' && newObj[k] !== undefined && newObj[k] !== null) {
                    // If corresponding value is actually an array (b/c an "Array" is an object in JS) then...
                    if (Array.isArray(newObj[k])) {
                        // Create key-value pair with array from new object or old object if it already exists
                        curObj[k] = Array.isArray(oldObj[k]) ? oldObj[k] : newObj[k]
                        // Else corresponding value is really an object, so...
                    } else {
                        // Create key-value pair with this function called on nested object
                        curObj[k] = _helper({}, oldObj[k], newObj[k])
                    }
                    // Else corresponding value is NOT an object, so...
                } else {
                    // We can just simply assign the value from the old object
                    curObj[k] = oldObj[k]
                }
                // Else the key does NOT exist in the old object, so...
            } else {
                // We create a new key-value pair with the value from the new object
                curObj[k] = newObj[k]
            }
        }

        return curObj
    }

    return _helper({}, oldObj, newObj) as T
}

/**
 * Generates a random number between a given beginning and end. This is NOT
 * cryptographically secure.
 *
 * @method generateRandomInteger
 *
 * @param {number} beginning
 * @param {number} end
 *
 * @returns {number}
 */
export const generateRandomInteger = (beginning: number, end: number): number =>
    Math.floor(Math.random() * end + beginning)
