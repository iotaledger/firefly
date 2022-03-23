import validUrl from 'valid-url'

export const PIN_LENGTH = 6

/**
 * Returns true if a URL is valid.
 */
export const isValidUrl = (url: string): boolean => {
    if (validUrl.isWebUri(url)) {
        return true
    }
    return false
}

/**
 * Returns true if an HTTPS URL is valid.
 */
export const isValidHttpsUrl = (url: string): boolean => {
    if (validUrl.isHttpsUri(url)) {
        return true
    }
    return false
}

/**
 * Does the string contain invalid filename chars
 * @param name The name to validate
 * @returns
 */
export const validateFilenameChars = (name: string | undefined): string => {
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

/**
 * Returns true if a pincode is valid.
 */
export const validatePinFormat = (pincode: string): boolean => {
    const REGEX = new RegExp(`^\\d{${PIN_LENGTH}}$`)
    return REGEX.test(pincode)
}
