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

        const valueBytes = Converter.hexToBytes(value)
        encodedParameters.writeUInt32SpecialEncoding('valueLength', valueBytes.length)
        encodedParameters.writeBytes('valueBytes', valueBytes.length, valueBytes)
    }
    return encodedParameters.finalBytes()
}
