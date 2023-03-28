import { encodeAddress, encodeAssetAllowance, encodeSmartContractParameters } from '../helpers'

import { WriteStream } from '@iota/util.js'
import { getAddressFromSubject } from '@core/wallet/utils'
import type { NewTransactionDetails } from '@core/wallet/types'
import { ACCOUNTS_CONTRACT, EXTERNALLY_OWNED_ACCOUNT, GAS_BUDGET, TRANSFER_ALLOWANCE } from '@core/layer-2'

export function getLayer2MetadataForTransfer(transactionDetails: NewTransactionDetails): string {
    const metadataStream = new WriteStream()

    metadataStream.writeUInt32('senderContract', EXTERNALLY_OWNED_ACCOUNT)
    metadataStream.writeUInt32('targetContract', ACCOUNTS_CONTRACT)
    metadataStream.writeUInt32('contractFunction', TRANSFER_ALLOWANCE)
    metadataStream.writeUInt64('gasBudget', GAS_BUDGET)

    const address = getAddressFromSubject(transactionDetails.recipient)
    const encodedAddress = encodeAddress(address.toLowerCase())

    const smartContractParameters = Object.entries({ a: encodedAddress })
    const parameters = encodeSmartContractParameters(smartContractParameters)
    metadataStream.writeBytes('smartContractParameters', parameters.length, parameters)

    const allowance = encodeAssetAllowance(transactionDetails)
    metadataStream.writeBytes('allowance', allowance.length, allowance)

    const metadata = '0x' + metadataStream.finalHex()
    return metadata
}
