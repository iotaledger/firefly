import { get } from 'svelte/store'
import { addError } from '@core/error'
import { BASE_TOKEN, networkHrp } from '@core/network'
import { activeProfile } from '@core/profile'
import {
    INewTransactionDetails,
    Subject,
    updateNewTransactionDetails,
    visibleSelectedAccountAssets,
} from '@core/wallet'
import { isValidAddressAndPrefix } from '@lib/address'
import { openPopup } from '@lib/popup'

import { SendOperationParameter } from '../../../enums'
import { AmountNotANumberError } from '@auxiliary/deep-link'

export function handleDeepLinkSendConfirmationOperation(searchParams: URLSearchParams): void {
    const transactionDetails = parseSendConfirmationOperation(searchParams)
    const unit = BASE_TOKEN?.[get(activeProfile)?.networkProtocol]?.unit

    if (transactionDetails) {
        updateNewTransactionDetails({ ...transactionDetails, unit })
        openPopup({
            type: 'sendConfirmation',
            overflow: true,
            props: {
                disableBack: true,
            },
        })
    }
}

/**
 * Parses a deep link for the send operation.
 *
 * @method parseSendConfirmationOperation
 *
 * @param {URLSearchParams} searchParams The query parameters of the deep link URL.
 *
 * @return {void | INewTransactionDetails} The formatted parameters for the send operation.
 */
function parseSendConfirmationOperation(searchParams: URLSearchParams): INewTransactionDetails {
    // Check address exists and is valid this is not optional.
    const address = searchParams.get(SendOperationParameter.Address)
    if (!address) {
        const message = 'No address specified in the url path'
        addError({ time: Date.now(), type: 'deepLink', message })
        throw new Error(message)
    }
    if (!isValidAddressAndPrefix(address, get(networkHrp))) {
        const message = `Address or prefix is not valid for ${address}`
        addError({
            time: Date.now(),
            type: 'deepLink',
            message,
        })
        throw new Error(message)
    }

    // Optional parameter: amount
    // Check if exists and is valid or does not exist
    let parsedAmount: number
    const amountParam = searchParams.get(SendOperationParameter.Amount)
    if (amountParam) {
        parsedAmount = Number(amountParam)
        if (!parsedAmount) {
            throw new AmountNotANumberError(amountParam)
        }
    } else {
        parsedAmount = 0
    }

    const asset = get(visibleSelectedAccountAssets)?.baseCoin
    const amount = String(Math.abs(parsedAmount))
    const unit = searchParams.get(SendOperationParameter.Unit)
    const metadata = searchParams.get(SendOperationParameter.Metadata)
    const tag = searchParams.get(SendOperationParameter.Tag)
    const recipient: Subject = { type: 'address', address }
    const giftStorageDeposit = Boolean(searchParams.get(SendOperationParameter.GiftStorageDeposit))
    const disableToggleGift = Boolean(searchParams.get(SendOperationParameter.DisableToggleGift))
    const disableChangeExpiration = Boolean(searchParams.get(SendOperationParameter.DisableChangeExpiration))

    return {
        ...(asset && { asset }),
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
