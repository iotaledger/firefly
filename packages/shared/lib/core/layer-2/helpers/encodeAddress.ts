import { WriteStream } from '@iota/util.js'
import { Converter } from '@core/utils'

export function encodeAddress(address: string): string {
    const encodedAddress = new WriteStream()
    const addressBytes = Converter.hexToBytes(address)
    for (const byte of addressBytes) {
        encodedAddress.writeUInt8('Address byte', byte)
    }
    return encodedAddress.finalHex()
}
