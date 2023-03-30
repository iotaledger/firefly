import { Converter } from '@core/utils'
import { WriteStream } from '@iota/util.js'

export function encodeSmartContractParameters(parameters: [string, string][]): Uint8Array {
    const encodedParameters = new WriteStream()
    encodedParameters.writeUInt32('parametersLength', parameters.length)

    for (const parameter of parameters) {
        const [key, value] = parameter

        const keyBytes = Converter.utf8ToBytes(key)
        encodedParameters.writeUInt16('keyLength', key.length)
        encodedParameters.writeBytes('keyBytes', keyBytes.length, keyBytes)

        const valueBytes = Converter.hexToBytes(value)
        encodedParameters.writeUInt32('valueLength', valueBytes.length)
        encodedParameters.writeBytes('valueBytes', valueBytes.length, valueBytes)
    }
    return encodedParameters.finalBytes()
}
