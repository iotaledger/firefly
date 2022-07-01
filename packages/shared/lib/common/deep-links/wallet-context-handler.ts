import { localize } from '@core/i18n'
import { isValidAddressAndPrefix } from '../../address'
import { addError } from '../../errors'
import { DeepLinkContext, SendOperationSearchParameter, WalletOperation } from '@common/deep-links/enums'
import { DeepLinkRequest } from '@common/deep-links/types'
import { ISendFormParameters, Subject } from '@core/wallet'

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

/**
 * Parses a deep link for the send operation.
 *
 * @method parseSendOperation
 *
 * @param {string} address The recipient's Bech32 address.
 * @param {URLSearchParams} searchParams The query parameters of the deep link URL.
 * @param {string} expectedAddressPrefix The expected human-readable part of a Bech32 address.
 *
 * @return {void | ISendFormParameters} The formatted parameters for the send operation.
 */
const parseSendOperation = (
    address: string,
    searchParams: URLSearchParams,
    expectedAddressPrefix: string
): void | ISendFormParameters => {
    let parsedAmount: number | undefined

    // Check address exists and is valid this is not optional.
    if (!address) {
        return addError({ time: Date.now(), type: 'deepLink', message: 'No address specified in the url path' })
    }
    if (!isValidAddressAndPrefix(address, expectedAddressPrefix)) {
        return addError({
            time: Date.now(),
            type: 'deepLink',
            message: `Address or prefix is not valid for ${address}`,
        })
    }

    // Optional parameter: amount
    // Check if exists and is valid or does not exist
    const amountParam = searchParams.get(SendOperationSearchParameter.Amount)
    if (amountParam) {
        parsedAmount = Number(amountParam)
        if (Number.isNaN(parsedAmount) || !Number.isFinite(parsedAmount)) {
            return addError({ time: Date.now(), type: 'deepLink', message: `Amount is not a number '${amountParam}'` })
        }
    } else {
        parsedAmount = 0
    }

    const amount = String(Math.abs(parsedAmount))
    const unit = searchParams.get(SendOperationSearchParameter.Unit)
    const metadata = searchParams.get(SendOperationSearchParameter.Metadata)
    const tag = searchParams.get(SendOperationSearchParameter.Tag)
    const recipient: Subject = address ? { type: 'address', address } : undefined

    // if (parsedUnit === Unit._ && parsedAmount && !Number.isInteger(parsedAmount)) {
    //     return addError({
    //         time: Date.now(),
    //         type: 'deepLink',
    //         message: `For unit 'i' the amount must be an integer '${parsedAmount}'`,
    //     })
    // }

    return {
        ...(recipient && { recipient }),
        ...(amount && { amount }),
        ...(unit && { unit }),
        ...(metadata && { metadata }),
        ...(tag && { tag }),
    }
}
