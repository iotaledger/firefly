import { Converter } from '@iota/util.js'
import { parseLayer2MetadataForTransfer } from '../utils/parseLayer2MetadataForTransfer'

describe('Function: parseLayer2MetadataForTransfer.ts', () => {
    it('should correctly parse metadata with base token', () => {
        const metadata =
            '0x00000000025e4b3ca1e3f42320a1070000000000020000000100611500000003807d707f59f1345e1063dbb64f2495d1491283a001006301000000ff0040420f0000000000020000000000'
        const metadataByteArray = Converter.hexToBytes(metadata)
        const expected = {
            senderContract: '0x0',
            targetContract: 'Accounts',
            contractFunction: 'transferAllowanceTo',
            gasBudget: '500000',
            ethereumAddress: '0x807d707f59f1345e1063dbb64f2495d1491283a0',
            baseTokens: '1000000',
            nativeTokens: [],
            nfts: [],
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
            targetContract: 'Accounts',
            contractFunction: 'transferAllowanceTo',
            gasBudget: '18446744073709551615',
            ethereumAddress: '0x8cc8112290f8c350a60e1afdb8379c686e2a5bb3',
            baseTokens: '0',
            nativeTokens: [
                {
                    amount: '50',
                    ID: ['0x08fcccc313acc182fc2c647dc98864062b163a8ee254231d7f029dc6be3a2de52e0100000000'],
                },
            ],
            nfts: [],
        }
        const parsedMetadata = parseLayer2MetadataForTransfer(metadataByteArray)
        expect(parsedMetadata).toEqual(expected)
    })

    it('should correctly parse metadata with nfts', () => {
        const metadata =
            '0x00000000025e4b3ca1e3f42320a1070000000000010000000100611500000003cbcd6d8659ed1998a452335ae53904dc0af1c99b00000000000000000002000000010066b71141974aa368c9152a24d631494b46172ba05dd998eef553e7fa1218b704'
        const metadataByteArray = Converter.hexToBytes(metadata)
        const expected = {
            senderContract: '0x0',
            targetContract: 'Accounts',
            contractFunction: 'transferAllowanceTo',
            gasBudget: '500000',
            ethereumAddress: '0xcbcd6d8659ed1998a452335ae53904dc0af1c99b',
            baseTokens: '0',
            nativeTokens: [],
            nfts: ['0x66b71141974aa368c9152a24d631494b46172ba05dd998eef553e7fa1218b704'],
        }
        const parsedMetadata = parseLayer2MetadataForTransfer(metadataByteArray)
        expect(parsedMetadata).toEqual(expected)
    })
})
