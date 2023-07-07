import { WriteStream } from '@iota/util.js'
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
