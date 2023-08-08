import { Converter } from '@core/utils'
import { Blake2b } from '@iota/crypto.js'

// TODO-sdk Replace/remove in favour of sdk Utils
export function hashOutputId(outputId: string): string {
    return Converter.bytesToHex(Blake2b.sum256(Converter.hexToBytes(outputId)))
}
