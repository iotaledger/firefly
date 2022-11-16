import validUrl from 'valid-url'

import { PIN_LENGTH } from './constants'

export function isValidPin(pin: string): boolean {
    const REGEX = new RegExp(`^\\d{${PIN_LENGTH}}$`)
    return REGEX.test(pin)
}

export function isValidUri(url: string): boolean {
    return validUrl.isUri(url)
}

export function isValidUrl(url: string): boolean {
    return validUrl.isWebUri(url)
}

export function isValidHttpsUrl(url: string): boolean {
    return validUrl.isHttpsUri(url)
}

/**
 * Does the string contain invalid filename chars
 * @param name The name to validate
 * @returns
 */
export function validateFilenameChars(name: string | undefined): string {
    if (!name) {
        return 'emptyName'
    }
    if (name.startsWith('~')) {
        return 'tilde'
    }
    /* eslint-disable no-control-regex */
    if (/[\u0000-\u001f\u0080-\u009f]/g.test(name)) {
        return 'control'
    }
    if (/^\.\./.test(name)) {
        return 'startDot'
    }
    if (/[<>:"/\\|?*]/g.test(name)) {
        return 'chars'
    }
}
