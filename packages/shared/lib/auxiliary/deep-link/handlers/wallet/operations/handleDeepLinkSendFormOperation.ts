import { networkHrp } from '@core/network'
import {
    INewTransactionDetails,
    Subject,
    updateNewTransactionDetails,
    visibleSelectedAccountAssets,
} from '@core/wallet'
import { isValidAddressAndPrefix } from '@lib/address'
import { openPopup } from '@lib/popup'
import { get } from 'svelte/store'

import { SendOperationParameter } from '../../../enums'
import { InvalidAddressError, NoAddressSpecifiedError } from '../../../errors'
import { getAmountFromSearchParam } from '../../../utils'

export function handleDeepLinkSendFormOperation(searchParams: URLSearchParams): void {
    const transactionDetails = parseSendFormOperation(searchParams)

    if (transactionDetails) {
        updateNewTransactionDetails({ ...transactionDetails })
        openPopup({
            type: 'sendForm',
            overflow: true,
        })
    }
}

/**
 * Parses a deep link for the send form operation.
 *
 * @method parseSendFormOperation
 *
 * @param {URLSearchParams} searchParams The query parameters of the deep link URL.
 *
 * @return {INewTransactionDetails} The formatted parameters for the send operation.
 */
function parseSendFormOperation(searchParams: URLSearchParams): INewTransactionDetails {
    // Check address exists and is valid this is not optional.
    const address = searchParams.get(SendOperationParameter.Address)
    if (!address) {
        throw new NoAddressSpecifiedError()
    }
    if (!isValidAddressAndPrefix(address, get(networkHrp))) {
        throw new InvalidAddressError()
    }

    const asset = get(visibleSelectedAccountAssets)?.baseCoin
    const amount = getAmountFromSearchParam(searchParams, asset?.metadata)

    const unit = searchParams.get(SendOperationParameter.Unit)
    const metadata = searchParams.get(SendOperationParameter.Metadata)
    const tag = searchParams.get(SendOperationParameter.Tag)
    const recipient: Subject = address ? { type: 'address', address } : undefined

    return {
        ...(recipient && { recipient }),
        ...(amount && { amount }),
        ...(unit && { unit }),
        ...(metadata && { metadata }),
        ...(tag && { tag }),
    }
}
