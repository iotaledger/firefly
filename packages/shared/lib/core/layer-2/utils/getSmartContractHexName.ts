import { Blake2b } from '@iota/crypto.js'
import { Converter } from '@iota/util.js'
import { Buffer } from 'buffer'
import { SimpleBufferCursor } from '../classes'

export function getSmartContractHexName(name: string): number {
    const SMART_CONTRACT_HEX_NAME_LENGTH = 4
    const stringBytes = Converter.utf8ToBytes(name)
    const hash = Blake2b.sum256(stringBytes)

    for (let i = 0; i < hash.length; i += SMART_CONTRACT_HEX_NAME_LENGTH) {
        const slice = hash.slice(i, i + SMART_CONTRACT_HEX_NAME_LENGTH)
        const cursor = new SimpleBufferCursor(Buffer.from(slice))

        return cursor.readUInt32LE()
    }

    return 0
}
