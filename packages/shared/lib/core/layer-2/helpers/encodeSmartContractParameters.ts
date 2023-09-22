import { Converter } from '@core/utils'
import { SpecialStream } from '../classes'

export function encodeSmartContractParameters(parameters: [string, string][]): Uint8Array {
    const encodedParameters = new SpecialStream()
    encodedParameters.writeUInt32SpecialEncoding('parametersLength', parameters.length)

    for (const parameter of parameters) {
        const [key, value] = parameter

        const keyBytes = Converter.utf8ToBytes(key)
        encodedParameters.writeUInt32SpecialEncoding('keyLength', key.length)
        encodedParameters.writeBytes('keyBytes', keyBytes.length, keyBytes)

        // const valueBytes = Converter.hexToBytes(value)
        const evmAddressToAgentIdBuffer = evmAddressToAgentID(value)

        encodedParameters.writeUInt32SpecialEncoding('valueLength', evmAddressToAgentIdBuffer.length)
        encodedParameters.writeUint8Array('valueBytes', evmAddressToAgentIdBuffer)
    }
    return encodedParameters.finalBytes()
}

function evmAddressToAgentID(evmStoreAccount: string): Uint8Array {
    // This function constructs an AgentID that is required to be used with contracts
    // Wasp understands different AgentID types and each AgentID needs to provide a certain ID that describes it's address type.
    // In the case of EVM addresses it's ID 3.
    const agentIDKindEthereumAddress = 3

    // Note: we need the evmStoreAccount to be in lower case,
    // otherwise fetching balances using the iscmagic contract will fail,
    // because evm addresses are case-insensitive but hexToBytes is not.
    const receiverAddrBinary = Converter.hexToBytes(evmStoreAccount?.toLowerCase())
    const aliasAddress = Converter.hexToBytes('rms1ppnkvsjctdg53v2x89uzhuxg89s073jmn2nuzcw44tggjy8rzzgzq2rg0qp')
    const aliasAddressInBytes = new Uint8Array([0, ...aliasAddress])

    const agentIdBytes = new Uint8Array([agentIDKindEthereumAddress, ...aliasAddressInBytes, ...receiverAddrBinary])

    return agentIdBytes
}
