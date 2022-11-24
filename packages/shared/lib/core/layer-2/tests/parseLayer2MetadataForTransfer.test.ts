import { Converter } from '@iota/util.js'
import { parseLayer2MetadataForTransfer } from '../actions/parseLayer2MetadataForTransfer'

describe('Function: parseLayer2MetadataForTransfer.ts', () => {
    it('should correctly parse metadata with base token', () => {
        const metadata =
            '0x00000000025e4b3ca1e3f42320a1070000000000020000000100611500000003807d707f59f1345e1063dbb64f2495d1491283a001006301000000ff0040420f0000000000020000000000'
        const metadataByteArray = Converter.hexToBytes(metadata)
        const expected = {
            senderContract: '0x0',
            targetContract: '0x3c4b5e02',
            contractFunction: '0x23f4e3a1',
            gasBudget: '500000',
            forceOpenAccount: true,
            ethereumAddress: '0x807d707f59f1345e1063dbb64f2495d1491283a0',
            baseTokenAmount: '1000000',
            nativeTokens: [],
        }
        const parsedMetadata = parseLayer2MetadataForTransfer(metadataByteArray)
        expect(parsedMetadata).toEqual(expected)
    })

    it('should correctly parse metadata with native tokens', () => {
        const metadata =
            '0x00000000025e4b3ca1e3f423ffffffffffffffff0200000001006115000000038cc8112290f8c350a60e1afdb8379c686e2a5bb301006301000000ff0000000000000000004800010008fcccc313acc182fc2c647dc98864062b163a8ee254231d7f029dc6be3a2de52e010000000032000000000000000000000000000000000000000000000000000000000000000000'
        const metadataByteArray = Converter.hexToBytes(metadata)
        const expected = {
            senderContract: '0x0',
            targetContract: '0x3c4b5e02',
            contractFunction: '0x23f4e3a1',
            gasBudget: '18446744073709551615',
            forceOpenAccount: true,
            ethereumAddress: '0x8cc8112290f8c350a60e1afdb8379c686e2a5bb3',
            baseTokenAmount: '0',
            nativeTokens: [
                {
                    amount: '3276800',
                    tokenId: '010008fcccc313acc182fc2c647dc98864062b163a8ee254231d7f029dc6be3a2de52e010000',
                },
            ],
        }
        const parsedMetadata = parseLayer2MetadataForTransfer(metadataByteArray)
        expect(parsedMetadata).toEqual(expected)
    })
})
