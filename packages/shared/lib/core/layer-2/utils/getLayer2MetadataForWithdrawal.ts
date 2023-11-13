import BigInteger from 'big-integer'
import { SpecialStream } from '../classes'
import { ACCOUNTS_CONTRACT, EXTERNALLY_OWNED_ACCOUNT, WITHDRAW } from '../constants'
import { encodeSmartContractParameters } from '../helpers'

export function getLayer2MetadataForWithdrawal(address: string, amount: number, estimatedGas?: number): string {
    const metadataStream = new SpecialStream()

    metadataStream.writeUInt8('senderContract', EXTERNALLY_OWNED_ACCOUNT)
    metadataStream.writeUInt32('targetContract', ACCOUNTS_CONTRACT)
    metadataStream.writeUInt32('contractFunction', WITHDRAW)
    metadataStream.writeUInt64SpecialEncoding(
        'gasBudget',
        estimatedGas ? BigInteger(estimatedGas) : BigInteger(Number.MAX_SAFE_INTEGER)
    )

    // Smart contracts parameters, empty
    const parameters = encodeSmartContractParameters([])
    metadataStream.writeBytes('smartContractParameters', parameters.length, parameters)

    // Allowance
    metadataStream.writeUInt64SpecialEncoding('baseTokenAmount', BigInteger(amount))

    return '0x' + metadataStream.finalHex()
}
