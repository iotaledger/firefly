import { WriteStream } from '@iota/util.js'
import { Converter } from '@core/utils'
import { EXTERNALLY_OWNED_ACCOUNT_TYPE_ID } from '../constants'

export function encodeAddress(address: string): string {
    const encodedAddress = new WriteStream()
    encodedAddress.writeUInt8('Address Type ID', EXTERNALLY_OWNED_ACCOUNT_TYPE_ID)
    const addressBytes = Converter.hexToBytes(address)
    for (const byte of addressBytes) {
        encodedAddress.writeUInt8('Address byte', byte)
    }
    return encodedAddress.finalHex()
}
