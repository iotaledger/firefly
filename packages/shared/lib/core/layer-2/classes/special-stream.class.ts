import { WriteStream, ReadStream } from '@iota/util.js'
import BigInteger from 'big-integer'
import { Buffer } from 'buffer'

export class SpecialStream extends WriteStream {
    writeUInt64SpecialEncoding(name: string, value: BigInteger.BigInteger): void {
        const encodedValue = size64Encode(BigInt(value.toString()))
        this.writeBytes(name, encodedValue.length, encodedValue)
    }

    writeUInt32SpecialEncoding(name: string, value: number): void {
        const encodedValue = size64Encode(BigInt(value))
        this.writeBytes(name, encodedValue.length, encodedValue)
    }

    writeUint8Array(name: string, bytes: Uint8Array): void {
        for (let i = 0; i < bytes.length; i++) {
            this.writeUInt8(name + i, bytes[i])
        }
    }
}

export class ReadSpecialStream extends ReadStream {
    readUInt64SpecialEncoding(name: string): number | bigint {
        const [value] = size64Decode(() => this.readUInt8(name))
        return value
    }

    readUInt32SpecialEncoding(name: string): number | bigint {
        const [value] = size64Decode(() => this.readUInt8(name))
        return value
    }
    readUInt16SpecialEncoding(name: string): number | bigint {
        const [value] = size64Decode(() => this.readUInt8(name))
        return value
    }

    readUIntNSpecialEncoding(name: string, length: number): number | bigint {
        const readValue = this.readBytes(name, length)
        let index = 0
        const [value] = size64Decode(() => {
            const val = readValue[index]
            index += 1
            return val
        })
        return value
    }
}

function shiftRight(n: bigint, shift: bigint): bigint {
    return n >> shift
}

function size64Encode(n: bigint): Buffer {
    const parts: number[] = []
    while (n >= 0x80) {
        parts.push(Number((n & BigInt(0x7f)) | BigInt(0x80)))
        n = shiftRight(n, BigInt(7))
    }
    parts.push(Number(n)) // Last byte, without the continuation bit

    return Buffer.from(parts)
}

function size64Decode(readByte: () => number): [bigint, null | Error] {
    let byte = readByte()
    if (byte < 0x80) {
        return [BigInt(byte), null]
    }

    let value = BigInt(byte & 0x7f)
    let shift = 7
    while (shift < 64) {
        byte = readByte()
        if (byte === -1) {
            // Assuming -1 signifies end of data or error in readByte
            return [BigInt(0), new Error('Unexpected end of data')]
        }
        value |= BigInt(byte & 0x7f) << BigInt(shift)
        if (byte < 0x80) {
            return [value, null]
        }
        shift += 7
    }

    return [BigInt(0), new Error('size64 overflow')]
}
