import { Unit } from '@iota/unit-converter'

import { getByteLengthOfString } from '@core/utils'

enum WalletOperation {
    Send = 'send',
}

/**
 * The query parameters available in a send operation.
 */
enum SendOperationParameter {
    Amount = 'amount',
    Unit = 'unit',
    Tag = 'tag',
    Metadata = 'metadata',
}

/**
 * A union type of all deep link operations' parameters.
 */
type DeepLinkParameters = SendOperationParameters

/**
 * The parameters of a send operation.
 */
type SendOperationParameters = {
    address: string
    amount: number
    tag: string | null
    metadata: string | null
}

/**
 * The contexts available in an IOTA deep link.
 */
enum DeepLinkContext {
    Wallet = 'wallet',
}

/**
 * Parses a deep link within the wallet context.
 *
 * @method parseChrysalisDeepLink
 *
 * @param {URL} deepLinkUrl The URL that was opened by the user.
 * @param {string} protocol The URL protocol from the deeplink.
 *
 * @return {DeepLinkRequest} The formatted content of a deep link request within the wallet context.
 */
export const convertChrysalisDeepLinkToStardust = (deepLinkUrl: URL, protocol: string): URL => {
    // Remove any leading and trailing slashes
    const pathnameParts = deepLinkUrl.pathname.replace(/^\/+|\/+$/g, '').split('/')

    let parameters: DeepLinkParameters

    // Check deeplink context
    switch (deepLinkUrl.hostname) {
        case DeepLinkContext.Wallet:
            break
        default:
            throw new Error(`Unrecognized wallet context '${deepLinkUrl.hostname}'`)
    }

    // Check deeplink operation
    switch (pathnameParts[0]) {
        case WalletOperation.Send:
            parameters = parseSendOperation(pathnameParts[1] ?? '', deepLinkUrl.searchParams)
            break
        default:
            throw new Error(`Unrecognized wallet operation '${pathnameParts[0]}'`)
    }

    // Construct the new Stardust equivalent URL
    const stardustUrl = new URL(`${protocol}://wallet/`)

    if (parameters.address) {
        stardustUrl.pathname += 'sendForm'
        stardustUrl.searchParams.append('address', parameters.address)
        stardustUrl.searchParams.append('amount', parameters.amount.toString())

        if (parameters.metadata) {
            stardustUrl.searchParams.append('metadata', parameters.metadata)
        }
        if (parameters.tag) {
            stardustUrl.searchParams.append('tag', parameters.tag)
        }
    }

    return new URL(stardustUrl)
}

/**
 * Parses a deep link for the send operation.
 *
 * @method parseSendOperation
 *
 * @param {string} address The recipient's Bech32 address.
 * @param {URLSearchParams} searchParams The query parameters of the deep link URL.
 *
 * @return {SendOperationParameters} The parameters for the send operation.
 */
const parseSendOperation = (address: string, searchParams: URLSearchParams): SendOperationParameters => {
    let amount = 0

    // Check if address exists
    if (!address) {
        throw new Error('No address specified in the url path')
    }

    // Check amount quantity
    const amountParam = searchParams.get(SendOperationParameter.Amount)
    if (amountParam) {
        const amountParamNumber = Number(amountParam)
        if (isNaN(amountParamNumber) || !isFinite(amountParamNumber)) {
            throw new Error(`Amount is not a number '${amountParam}'`)
        }

        amount = Math.abs(Number(amountParamNumber))
    }

    // (optional) Check amount unit
    const unitParam = searchParams.get(SendOperationParameter.Unit)
    if (unitParam) {
        const unitParamValue = (
            unitParam.length > 1
                ? unitParam.charAt(0).toUpperCase() + unitParam.slice(1).toLowerCase()
                : unitParam.toLowerCase()
        ) as Unit

        if (!Object.values(Unit).includes(unitParamValue)) {
            throw new Error(`Unit is not recognised '${unitParam}'`)
        }

        if (unitParamValue === Unit.i && !Number.isInteger(amount)) {
            throw new Error(`For unit 'i' the amount must be an integer '${amount}'`)
        }

        amount = transformAmountWithUnit(amount, unitParamValue)
    }

    // (optional) Check tag
    const tag = searchParams.get(SendOperationParameter.Tag)
    if (tag) {
        if (getByteLengthOfString(tag) > 64) {
            throw new Error('')
        }
    }

    // (optional) Check metadata
    const metadata = searchParams.get(SendOperationParameter.Metadata)
    if (metadata) {
        if (getByteLengthOfString(metadata) > 8192) {
            throw new Error('')
        }
    }

    return {
        address,
        amount,
        tag,
        metadata,
    }
}

// Firefly will use the IOTA unit, so we must also scale the amount if the user provided another unit.
function transformAmountWithUnit(amount: number, unit: Unit): number {
    switch (unit) {
        case Unit.Pi:
            return amount * 1_000_000_000_000_000
        case Unit.Ti:
            return amount * 1_000_000_000_000
        case Unit.Gi:
            return amount * 1_000_000_000
        case Unit.Mi:
            return amount * 1_000_000
        case Unit.Ki:
            return amount * 1_000
        case Unit.i:
            return amount
    }
}
