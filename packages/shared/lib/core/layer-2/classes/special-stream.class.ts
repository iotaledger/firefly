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
    readUInt64SpecialEncodingWithError(name: string): [bigint, Error | null] {
        return size64Decode(() => this.readUInt8(name))
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

function shiftLeft(s: bigint, n: bigint): bigint {
    const result = BigInteger(s).multiply(BigInteger(2).pow(BigInteger(n)))
    return BigInt(result.toString())
}

function shiftRight(s: bigint, n: bigint): bigint {
    const result = BigInteger(s).divide(BigInteger(2).pow(BigInteger(n)))
    return BigInt(result.toString())
}
// from https://github.com/iotaledger/wasp/blob/12845adea4fc097813a30a061853af4a43407d3c/packages/util/rwutil/convert.go#L113
function size64Encode(n: bigint): Buffer {
    if (n < BigInt(0x80)) {
        return Buffer.from([Number(n)])
    } else if (n < BigInt(0x4000)) {
        return Buffer.from([Number(n | BigInt(0x80)), Number(shiftRight(n, BigInt(7)))])
    } else if (n < BigInt(0x20_0000)) {
        return Buffer.from([
            Number(n | BigInt(0x80)),
            Number(shiftRight(n, BigInt(7)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(14))),
        ])
    } else if (n < BigInt(0x1000_0000)) {
        return Buffer.from([
            Number(n | BigInt(0x80)),
            Number(shiftRight(n, BigInt(7)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(14)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(21))),
        ])
    } else if (n < BigInt(0x8_0000_0000)) {
        return Buffer.from([
            Number(n | BigInt(0x80)),
            Number(shiftRight(n, BigInt(7)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(14)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(21)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(28))),
        ])
    } else if (n < BigInt(0x400_0000_0000)) {
        return Buffer.from([
            Number(n | BigInt(0x80)),
            Number(shiftRight(n, BigInt(7)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(14)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(21)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(28)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(35))),
        ])
    } else if (n < BigInt(0x2_0000_0000_0000)) {
        return Buffer.from([
            Number(n | BigInt(0x80)),
            Number(shiftRight(n, BigInt(7)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(14)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(21)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(28)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(35)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(42))),
        ])
    } else if (n < BigInt(0x100_0000_0000_0000)) {
        return Buffer.from([
            Number(n | BigInt(0x80)),
            Number(shiftRight(n, BigInt(7)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(14)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(21)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(28)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(35)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(42)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(49))),
        ])
    } else if (n < BigInt(0x8000_0000_0000_0000)) {
        return Buffer.from([
            Number(n | BigInt(0x80)),
            Number(shiftRight(n, BigInt(7)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(14)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(21)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(28)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(35)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(42)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(49)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(56))),
        ])
    } else {
        return Buffer.from([
            Number(n | BigInt(0x80)),
            Number(shiftRight(n, BigInt(7)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(14)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(21)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(28)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(35)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(42)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(49)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(56)) | BigInt(0x80)),
            Number(shiftRight(n, BigInt(63))),
        ])
    }
}

// Adapted from WASP golang implementation https://github.com/iotaledger/wasp/blob/7f880a7983d24d0dcd225e994d67b29741b318bc/packages/util/rwutil/convert.go#L76
function size64Decode(readByte: () => number): [bigint, null | Error] {
    let byte = BigInt(readByte())

    if (!byte) {
        return [BigInt(0), new Error('no more bytes')]
    }

    if (byte < 0x80) {
        return [byte, null]
    }

    let value = byte & BigInt(0x7f)

    for (let shift = 7; shift < 63; shift += 7) {
        byte = BigInt(readByte())
        if (!byte) {
            return [BigInt(0), new Error('no more bytes')]
        }
        if (byte < 0x80) {
            return [value | shiftLeft(byte, BigInt(shift)), null]
        }
        value |= shiftLeft(byte & BigInt(0x7f), BigInt(shift))
    }

    byte = BigInt(readByte())
    if (!byte) {
        return [BigInt(0), new Error('no more bytes')]
    }
    if (byte > 0x01) {
        return [BigInt(0), new Error('size64 overflow')]
    }

    return [value | shiftLeft(byte, BigInt(63)), null]
}
