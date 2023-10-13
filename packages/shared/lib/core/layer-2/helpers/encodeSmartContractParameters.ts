import { Converter } from '@core/utils'
import { SpecialStream } from '../classes'

export function encodeSmartContractParameters(parameters: [string, Uint8Array][]): Uint8Array {
    const encodedParameters = new SpecialStream()
    encodedParameters.writeUInt32SpecialEncoding('parametersLength', parameters.length)

    for (const parameter of parameters) {
        const [key, value] = parameter

        const keyBytes = Converter.utf8ToBytes(key)
        encodedParameters.writeUInt32SpecialEncoding('keyLength', key.length)
        encodedParameters.writeBytes('keyBytes', keyBytes.length, keyBytes)

        encodedParameters.writeUInt32SpecialEncoding('valueLength', value.length)
        encodedParameters.writeBytes('valueBytes', value.length, value)
    }
    return encodedParameters.finalBytes()
}
