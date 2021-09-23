import { Unit } from '@iota/unit-converter'
import { addError } from 'shared/lib/errors'
import { writable } from 'svelte/store'

/**
 * Indicates that a deep link request is active
 */
export const deepLinkRequestActive = writable<boolean>(false)

/**
 * Parse an IOTA deep link i.e. a link that begins with the scheme iota://
 *
 * @method parseDeepLink
 *
 * @param {string} addressPrefix First four characters of address
 * @param {string} input The link that was opened
 */
export const parseDeepLink = (addressPrefix, input) => {
    if (!input || typeof input !== 'string') {
        return
    }

    try {
        const url = new URL(input)

        if (url.protocol === 'iota:') {
            if (url.host === 'wallet') {
                // Remove any leading and trailing slashes
                const pathParts = url.pathname.replace(/^\/+|\/+$/g, '').split('/')

                if (pathParts.length === 0) {
                    return addError({ time: Date.now(), type: 'deepLink', message: 'No op part in the url path' })
                }

                if (pathParts[0] === 'send') {
                    return parseWalletSendDeepLink(addressPrefix, url, pathParts.slice(1))
                }
                return addError({ time: Date.now(), type: 'deepLink', message: `Unrecognized wallet action '${pathParts[0]}'` })
            } else {
                return addError({ time: Date.now(), type: 'deepLink', message: `Unrecognized context '${url.host}'` })
            }
        } else {
            return addError({
                time: Date.now(),
                type: 'deepLink',
                message: `Error handling deep link. Does not start with iota://`,
            })
        }
    } catch (err) {
        return addError({ time: Date.now(), type: 'deepLink', message: `Error handling deep link. ${err.message}` })
    }
}

/**
 * Parse a deep link for sending via the wallet (iota://wallet/send)
 *
 * @method parseWalletSendDeepLink
 *
 * @param {string} addressPrefix
 * @param {URL} url
 * @param {string[]} pathParts
 * @return {object} The formatted deep link content for populating the send params
 */
export const parseWalletSendDeepLink = (addressPrefix, url, pathParts) => {
    if (pathParts.length === 0) {
        return addError({ time: Date.now(), type: 'deepLink', message: 'No address part in the url path' })
    }

    // Path starts with '/' so ignore the first one
    const address = pathParts[0]

    if (!new RegExp(`^${addressPrefix}1[02-9ac-hj-np-z]{59}$`).test(address)) {
        return addError({
            time: Date.now(),
            type: 'deepLink',
            message: `Address '${address}' does not match prefix '${addressPrefix}' or format`,
        })
    }

    const amountParam = url.searchParams.get('amt') ?? 0
    const parsedAmount = Number.parseFloat(amountParam)
    if (Number.isNaN(parsedAmount) || !Number.isFinite(parsedAmount)) {
        return addError({ time: Date.now(), type: 'deepLink', message: `Amount is not a number '${amountParam}'` })
    }

    const unitParam = url.searchParams.get('unit') ?? Unit.i
    const parsedUnit: Unit =
        unitParam.length > 1
            ? unitParam.charAt(0).toUpperCase() + unitParam.slice(1).toLowerCase()
            : (unitParam.toLowerCase() as Unit)
    if (!Object.values(Unit).includes(parsedUnit)) {
        return addError({ time: Date.now(), type: 'deepLink', message: `Unit is not recognised '${unitParam}'` })
    }

    if (parsedUnit === 'i' && !Number.isInteger(parsedAmount)) {
        return addError({
            time: Date.now(),
            type: 'deepLink',
            message: `For unit 'i' the amount must be an integer '${parsedAmount}'`,
        })
    }

    return {
        context: 'wallet',
        operation: 'send',
        params: {
            address,
            amount: Math.abs(parsedAmount),
            unit: parsedUnit,
            message: url.searchParams.get('msg') ?? '',
        },
    }
}
