import { get } from 'svelte/store'

import { addError } from '@core/error'
import { BASE_TOKEN, networkHrp } from '@core/network'
import { activeProfile } from '@core/profile'
import { ISendFormParameters, Subject } from '@core/wallet'
import { isValidAddressAndPrefix } from '@lib/address'
import { openPopup } from '@lib/popup'

import { SendOperationParameter } from '../../../enums'

export function handleDeepLinkSendOperation(searchParams: URLSearchParams, skipForm = false): void {
    const sendFormParameters = parseSendOperation(searchParams)

    let unit: string
    if (skipForm) {
        unit = BASE_TOKEN?.[get(activeProfile)?.networkProtocol]?.unit
    }

    if (sendFormParameters) {
        openPopup({
            type: skipForm ? 'sendConfirmation' : 'sendForm',
            overflow: true,
            props: {
                ...sendFormParameters,
                ...(unit && { unit }),
            },
        })
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
function parseSendOperation(searchParams: URLSearchParams): void | ISendFormParameters {
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

    return {
        ...(recipient && { recipient }),
        ...(amount && { amount }),
        ...(unit && { unit }),
        ...(metadata && { metadata }),
        ...(tag && { tag }),
        ...(giftStorageDeposit && { giftStorageDeposit }),
    }
}
