import validUrl from 'valid-url'

export const PIN_LENGTH = 6

/**
 * Returns true if a pincode is valid.
 */
export const validatePinFormat = (pincode: string): boolean => {
    const REGEX = new RegExp(`^\\d{${PIN_LENGTH}}$`)
    return REGEX.test(pincode)
}

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
