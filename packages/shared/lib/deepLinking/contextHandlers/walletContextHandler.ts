import { Unit } from '@iota/unit-converter'
import { isValidAddressAndPrefix } from 'shared/lib/address'
import { addError } from 'shared/lib/errors'
import { localize } from 'shared/lib/i18n'
import { DeepLinkingContexts } from 'shared/lib/typings/deepLinking/deepLinking'
import {
    SendOperationParameters,
    SendRequestParameters,
    WalletOperations,
} from 'shared/lib/typings/deepLinking/walletContext'
import { NotificationData } from 'shared/lib/typings/notification'

/**
 * Parse the wallet context from a deeplink
 *
 * @method parseSendOperation
 *
 * @param {string} addressPrefix
 * @param {URLSearchParams} searchParams
 * @param {string} expectedAddressPrefix
 * @return {object} The formatted deep link content for populating the send params
 */
export const parseWalletRequest = (
    url: URL,
    expectedAddressPrefix: string
): void | {
    context: string
    operation: string
    params: void | {
        address: string
        amount: number
        unit: Unit
        message: string
    }
    notification: NotificationData
} => {
    let params
    // Remove any leading and trailing slashes
    const pathnameParts = url.pathname.replace(/^\/+|\/+$/g, '').split('/')

    if (pathnameParts.length === 0) {
        return addError({ time: Date.now(), type: 'deepLink', message: 'No operation specified in the url' })
    }

    switch (pathnameParts[0]) {
        case WalletOperations.Send:
            params = parseSendOperation(pathnameParts[1] ?? '', url.searchParams, expectedAddressPrefix)
            break
        default:
            return addError({
                time: Date.now(),
                type: 'deepLink',
                message: `Unrecognized wallet operation '${pathnameParts[0]}'`,
            })
    }

    return {
        context: DeepLinkingContexts.Wallet,
        operation: pathnameParts[0],
        params: params,
        notification: {
            type: 'info',
            message: localize('notifications.deepLinkingRequest.wallet.send.success'),
        },
    }
}

/**
 * Parse a send operation from a deeplink
 *
 * @method parseSendOperation
 *
 * @param {string} addressPrefix
 * @param {URLSearchParams} searchParams
 * @param {string} expectedAddressPrefix
 * @return {object} The formatted deep link content for populating the send params
 */
const parseSendOperation = (
    address: string,
    searchParams: URLSearchParams,
    expectedAddressPrefix: string
): SendOperationParameters | void => {
    let parsedAmount: number | undefined
    let parsedUnit: Unit | undefined

    // Check address exists and is valid this is not optional.
    if (!address) {
        return addError({ time: Date.now(), type: 'deepLink', message: 'No address specified in the url path' })
    }
    if (isValidAddressAndPrefix(address, expectedAddressPrefix)) {
        return addError({
            time: Date.now(),
            type: 'deepLink',
            message: `Address or prefix is not valid for ${address}`,
        })
    }

    // Optional parameter: amount
    // Check if exists and is valid or does not exist
    const amountParam = searchParams.get(SendRequestParameters.Amount)
    if (amountParam) {
        parsedAmount = Number(amountParam)
        if (Number.isNaN(parsedAmount) || !Number.isFinite(parsedAmount)) {
            return addError({ time: Date.now(), type: 'deepLink', message: `Amount is not a number '${amountParam}'` })
        }
    } else {
        parsedAmount = 0
    }

    let unitParam = searchParams.get(SendRequestParameters.Unit)
    if (unitParam) {
        unitParam =
            unitParam.length > 1
                ? unitParam.charAt(0).toUpperCase() + unitParam.slice(1).toLowerCase()
                : unitParam.toLowerCase()
        parsedUnit = Unit[unitParam]
        if (!Object.values(Unit).includes(parsedUnit)) {
            return addError({ time: Date.now(), type: 'deepLink', message: `Unit is not recognised '${unitParam}'` })
        }
    } else {
        unitParam = Unit.i
    }

    if (parsedUnit === Unit.i && parsedAmount && !Number.isInteger(parsedAmount)) {
        return addError({
            time: Date.now(),
            type: 'deepLink',
            message: `For unit 'i' the amount must be an integer '${parsedAmount}'`,
        })
    }

    return {
        address,
        amount: Math.abs(parsedAmount),
        unit: parsedUnit,
        message: '',
    }
}
