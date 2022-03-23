import { Unit } from '@iota/unit-converter'

import { localize } from '@core/i18n'
import { isValidAddressAndPrefix } from '@core/utils/crypto'
import { addError } from '@core/error'

import { DeepLinkContext, SendOperationParameter, WalletOperation } from './enums'
import { DeepLinkRequest, SendOperationParameters } from './types'

export function parseWalletDeepLinkRequest(url: URL, expectedAddressPrefix: string): void | DeepLinkRequest {
    let parameters

    // Remove any leading and trailing slashes
    const pathnameParts = url.pathname.replace(/^\/+|\/+$/g, '').split('/')

    if (pathnameParts.length === 0) {
        return addError({ time: Date.now(), type: 'deepLink', message: 'No operation specified in the url' })
    }

    switch (pathnameParts[0]) {
        case WalletOperation.Send:
            parameters = parseSendOperation(pathnameParts[1] ?? '', url.searchParams, expectedAddressPrefix)
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

function parseSendOperation(
    address: string,
    searchParams: URLSearchParams,
    expectedAddressPrefix: string
): void | SendOperationParameters {
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
    const amountParam = searchParams.get(SendOperationParameter.Amount)
    if (amountParam) {
        parsedAmount = Number(amountParam)
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
        amount: Math.abs(parsedAmount),
        unit: parsedUnit,
        message: '',
    }
}
