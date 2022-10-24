import { Converter } from '@lib/converter'
import { Blake2b } from '@iota/crypto.js'

export function hashOutputId(outputId: string): string {
    return '0x' + Converter.bytesToHex(Blake2b.sum256(Converter.hexToBytes(outputId.substring(2))))
}
