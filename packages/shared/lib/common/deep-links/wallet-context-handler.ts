import { Unit } from '@iota/unit-converter'

import { localize } from '@core/i18n'

import { isValidAddressAndPrefix } from '../../address'
import { addError } from '../../errors'

import { DeepLinkContext, SendOperationParameter, WalletOperation } from '@common/deep-links/enums'
import { DeepLinkParameters, DeepLinkRequest, SendOperationParameters } from '@common/deep-links/types'
import { formatNumber } from '@lib/currency'
import { getNumberOfDecimalPlaces } from '@lib/utils'

/**
 * Parses a deep link within the wallet context.
 *
 * @method parseWalletDeepLinkRequest
 *
 * @param {URL} url The URL that was opened by the user.
 * @param {string} expectedAddressPrefix The expected human-readable part of a Bech32 address.
 *
 * @return {void | DeepLinkRequest} The formatted content of a deep link request within the wallet context.
 */
export const parseWalletDeepLinkRequest = (url: URL, expectedAddressPrefix: string): void | DeepLinkRequest => {
    let parameters: DeepLinkParameters

    // Remove any leading and trailing slashes
    const pathnameParts = url.pathname.replace(/^\/+|\/+$/g, '').split('/')

    if (pathnameParts.length === 0) {
        return addError({ time: Date.now(), type: 'deepLink', message: 'No operation specified in the url' })
    }

    const address = pathnameParts[1] ?? ''
    if (!isValidAddress(address, expectedAddressPrefix)) {
        return addError({
            time: Date.now(),
            type: 'deepLink',
            message: `Address or prefix is not valid for ${address}`,
        })
    }

    switch (pathnameParts[0]) {
        case WalletOperation.Send:
            parameters = parseSendOperation(address, url.searchParams)
            break
        default:
            return addError({
                time: Date.now(),
                type: 'deepLink',
                message: `Unrecognized wallet operation '${pathnameParts[0]}'`,
            })
    }

    return {
        parameters,
        context: DeepLinkContext.Wallet,
        operation: pathnameParts[0],
        notification: {
            type: 'info',
            message: localize('notifications.deepLinkingRequest.wallet.send.success'),
        },
    }
}

/**
 * Parses a deep link for the send operation.
 *
 * @method parseSendOperation
 *
 * @param {string} address The recipient's Bech32 address.
 * @param {URLSearchParams} searchParams The query parameters of the deep link URL.
 *
 * @return {void | SendOperationParameters} The formatted parameters for the send operation.
 */
const parseSendOperation = (address: string, searchParams: URLSearchParams): void | SendOperationParameters => {
    let numDecimalPlaces = 0
    let parsedAmount: number | undefined
    let parsedUnit: Unit | undefined

    // Optional parameter: amount
    // Check if exists and is valid or does not exist
    const amountParam = searchParams.get(SendOperationParameter.Amount)
    if (amountParam) {
        parsedAmount = Number(amountParam)
        numDecimalPlaces = getNumberOfDecimalPlaces(parsedAmount)
        if (Number.isNaN(parsedAmount) || !Number.isFinite(parsedAmount)) {
            return addError({ time: Date.now(), type: 'deepLink', message: `Amount is not a number '${amountParam}'` })
        }
    } else {
        parsedAmount = 0
    }

    let unitParam = searchParams.get(SendOperationParameter.Unit)
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
        amount: formatNumber(Math.abs(parsedAmount), numDecimalPlaces, numDecimalPlaces),
        unit: parsedUnit,
        message: '',
    }
}

const isValidAddress = (address: string, expectedAddressPrefix: string): boolean => {
    if (address && isValidAddressAndPrefix(address, expectedAddressPrefix)) {
        return true
    } else {
        return false
    }
}
