import { get } from 'svelte/store'
import { addError } from '@core/error'
import { BASE_TOKEN, networkHrp } from '@core/network'
import { activeProfile } from '@core/profile'
import { ISendConfirmationParameters, Subject } from '@core/wallet'
import { isValidAddressAndPrefix } from '@lib/address'
import { openPopup } from '@lib/popup'

import { SendOperationParameter } from '../../../enums'

export function handleDeepLinkSendConfirmationOperation(searchParams: URLSearchParams): void {
    const sendFormParameters = parseSendConfirmationOperation(searchParams)

    const unit = BASE_TOKEN?.[get(activeProfile)?.networkProtocol]?.unit

    if (sendFormParameters) {
        openPopup({
            type: 'sendConfirmation',
            overflow: true,
            props: {
                disableBack: true,
                ...sendFormParameters,
                ...(unit && { unit }),
            },
        })
    }
}

/**
 * Parses a deep link for the send operation.
 *
 * @method parseSendConfirmationOperation
 *
 * @param {string} address The recipient's Bech32 address.
 * @param {URLSearchParams} searchParams The query parameters of the deep link URL.
 * @param {string} expectedAddressPrefix The expected human-readable part of a Bech32 address.
 *
 * @return {void | ISendConfirmationParameters} The formatted parameters for the send operation.
 */
function parseSendConfirmationOperation(searchParams: URLSearchParams): void | ISendConfirmationParameters {
    // Check address exists and is valid this is not optional.
    const address = searchParams.get(SendOperationParameter.Address)
    if (!address) {
        return addError({ time: Date.now(), type: 'deepLink', message: 'No address specified in the url path' })
    }
    if (!isValidAddressAndPrefix(address, get(networkHrp))) {
        return addError({
            time: Date.now(),
            type: 'deepLink',
            message: `Address or prefix is not valid for ${address}`,
        })
    }

    // Optional parameter: amount
    // Check if exists and is valid or does not exist
    let parsedAmount: number
    const amountParam = searchParams.get(SendOperationParameter.Amount)
    if (amountParam) {
        parsedAmount = Number(amountParam)
        if (!parsedAmount) {
            return addError({ time: Date.now(), type: 'deepLink', message: `Amount is not a number '${amountParam}'` })
        }
    } else {
        parsedAmount = 0
    }

    const amount = String(Math.abs(parsedAmount))
    const unit = searchParams.get(SendOperationParameter.Unit)
    const metadata = searchParams.get(SendOperationParameter.Metadata)
    const tag = searchParams.get(SendOperationParameter.Tag)
    const recipient: Subject = address ? { type: 'address', address } : undefined
    const giftStorageDeposit = Boolean(searchParams.get(SendOperationParameter.GiftStorageDeposit))
    const disableToggleGift = Boolean(searchParams.get(SendOperationParameter.DisableToggleGift))
    const disableChangeExpiration = Boolean(searchParams.get(SendOperationParameter.DisableChangeExpiration))

    return {
        ...(recipient && { recipient }),
        ...(amount && { amount }),
        ...(unit && { unit }),
        ...(metadata && { metadata }),
        ...(tag && { tag }),
        ...(giftStorageDeposit && { giftStorageDeposit }),
        ...(disableToggleGift && { disableToggleGift }),
        ...(disableChangeExpiration && { disableChangeExpiration }),
    }
}
