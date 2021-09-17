import { Unit } from '@iota/unit-converter';
import { addError } from 'shared/lib/errors';
import { writable } from 'svelte/store';

/**
 * Indicates that a deep link request is active
 */
export const deepLinkRequestActive = writable<boolean>(false)

export const IOTA_SCHEME = 'iota'

/**
 * Parse a deep link for the app (iota://)
 * @param {string} data Deep link data
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
                    return addError({ time: Date.now(), type: "deepLink", message: 'No op part in the url path' })
                }

                if (pathParts[0] === "send") {
                    return parseWalletSendDeepLink(addressPrefix, url, pathParts.slice(1))
                }
                return addError({ time: Date.now(), type: "deepLink", message: `Unrecognized wallet action '${pathParts[0]}'` })
            } else {
                return addError({ time: Date.now(), type: "deepLink", message: `Unrecognized context '${url.host}'` })
            }
        } else {
            return addError({ time: Date.now(), type: "deepLink", message: `Error handling deep link. Does not start with ${IOTA_SCHEME}//` })
        }
    } catch (err) {
        return addError({ time: Date.now(), type: "deepLink", message: `Error handling deep link. ${err.message}` })
    }
}

/**
 * Parse a deep link for the wallet (iota://wallet/send)
 * @param {url} The url
 * @param {pathParts} The path parts
 * @return {ParsedURL}  The parsed address, message and/or amount values
 */
export const parseWalletSendDeepLink = (addressPrefix, url, pathParts) => {
    if (pathParts.length === 0) {
        return addError({ time: Date.now(), type: "deepLink", message: 'No address part in the url path' })
    }

    // Path starts with '/' so ignore the first one
    const address = pathParts[0]

    if (!new RegExp(`^${addressPrefix}1[02-9ac-hj-np-z]{59}$`).test(address)) {
        return addError({ time: Date.now(), type: "deepLink", message: `Address '${address}' does not match prefix '${addressPrefix}' or format` })
    }

    const amountParam = url.searchParams.get('amt')
    const parsedAmount = Number.parseFloat(amountParam)
    if (Number.isNaN(parsedAmount) || !Number.isFinite(parsedAmount)) {
        return addError({ time: Date.now(), type: "deepLink", message: `Amount is not a number '${amountParam}'` })
    }

    const unitParam = url.searchParams.get('unit') ?? Unit
    const parsedUnit: Unit = unitParam.length > 1 ? unitParam.charAt(0).toUpperCase() + unitParam.slice(1).toLowerCase() : unitParam.toLowerCase() as Unit
    if (!Object.values(Unit).includes(parsedUnit)) {
        return addError({ time: Date.now(), type: "deepLink", message: `Unit is not recognised '${unitParam}'` })
    }

    if (parsedUnit === "i" && !Number.isInteger(parsedAmount)) {
        return addError({ time: Date.now(), type: "deepLink", message: `For unit 'i' the amount must be an integer '${parsedAmount}'` })
    }

    return {
        context: "wallet",
        operation: "send",
        params: {
            address,
            amount: Math.abs(parsedAmount),
            unit: parsedUnit,
            message: url.searchParams.get('msg') ?? ''
        }
    }
}