import { Converter } from '@core/utils'
import { Blake2b } from '@iota/crypto.js'

export function hashOutputId(outputId: string): string {
    return Converter.bytesToHex(Blake2b.sum256(Converter.hexToBytes(outputId)))
}
