import { WriteStream } from '@iota/util.js'
import { ACCOUNTS_CONTRACT, EXTERNALLY_OWNED_ACCOUNT, GAS_BUDGET, TRANSFER_ALLOWANCE } from '../constants'
import { encodeAddress, encodeAssetAllowance, encodeSmartContractParameters } from '../helpers'

export function getLayer2MetadataForTransfer(layer2Address: string): string {
    const metadataStream = new WriteStream()

    metadataStream.writeUInt32('senderContract', EXTERNALLY_OWNED_ACCOUNT)
    metadataStream.writeUInt32('targetContract', ACCOUNTS_CONTRACT)
    metadataStream.writeUInt32('contractFunction', TRANSFER_ALLOWANCE)
    metadataStream.writeUInt64('gasBudget', GAS_BUDGET)

    const encodedAddress = encodeAddress(layer2Address.toLowerCase())
    const smartContractParameters = Object.entries({ a: encodedAddress })
    const parameters = encodeSmartContractParameters(smartContractParameters)
    metadataStream.writeBytes('smartContractParameters', parameters.length, parameters)

    const allowance = encodeAssetAllowance()
    metadataStream.writeBytes('allowance', allowance.length, allowance)

    const metadata = '0x' + metadataStream.finalHex()
    return metadata
}
