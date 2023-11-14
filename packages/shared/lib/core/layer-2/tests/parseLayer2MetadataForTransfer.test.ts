import { Converter } from '@iota/util.js'
import { parseLayer2MetadataForTransfer } from '../utils/parseLayer2MetadataForTransfer'

describe('Function: parseLayer2MetadataForTransfer.ts', () => {
    it('should correctly parse metadata with base token', () => {
        const metadata =
            '0x00025e4b3ca1e3f423914e010161350342f7da9bdb55b3ec87e5ac1a1e6d88e16768663fde5eca3429eb6f579cc538acb82a77d6f89dae4611b81eac279fbf96d322001f8080d293ad03'
        const metadataByteArray = Converter.hexToBytes(metadata)
        const expected = {
            senderContract: '0x0',
            targetContract: 'Accounts',
            contractFunction: 'transferAllowanceTo',
            gasBudget: '10000',
            ethereumAddress: '0xb82a77d6f89dae4611b81eac279fbf96d322001f',
            baseTokens: '900000000',
            nativeTokens: [],
            nfts: [],
        }
        const parsedMetadata = parseLayer2MetadataForTransfer(metadataByteArray)
        expect(parsedMetadata).toEqual(expected)
    })

    it('should correctly parse metadata with native tokens', () => {
        const metadata =
            '0x00025e4b3ca1e3f423914e010161350342f7da9bdb55b3ec87e5ac1a1e6d88e16768663fde5eca3429eb6f579cc538acb82a77d6f89dae4611b81eac279fbf96d322001f4001086ac702fcfdc37b437e7ebb7a87d8acfb875be6b1ae3823bc61aa7896b852a6d5010000000001fa'
        const metadataByteArray = Converter.hexToBytes(metadata)
        const expected = {
            senderContract: '0x0',
            targetContract: 'Accounts',
            contractFunction: 'transferAllowanceTo',
            gasBudget: '10000',
            ethereumAddress: '0xb82a77d6f89dae4611b81eac279fbf96d322001f',
            baseTokens: '0',
            nativeTokens: [
                {
                    amount: '250',
                    ID: ['0x086ac702fcfdc37b437e7ebb7a87d8acfb875be6b1ae3823bc61aa7896b852a6d50100000000'],
                },
            ],
            nfts: [],
        }
        const parsedMetadata = parseLayer2MetadataForTransfer(metadataByteArray)
        expect(parsedMetadata).toEqual(expected)
    })

    it('should correctly parse metadata with nfts', () => {
        const metadata =
            '0x00025e4b3ca1e3f423e9cd01010161350342f7da9bdb55b3ec87e5ac1a1e6d88e16768663fde5eca3429eb6f579cc538acb82a77d6f89dae4611b81eac279fbf96d322001f2001bf5b7cd4e8ac582e246c25b6a89b4ab4ef0646d3291aa03d9a5313154b714a06'
        const metadataByteArray = Converter.hexToBytes(metadata)
        const expected = {
            senderContract: '0x0',
            targetContract: 'Accounts',
            contractFunction: 'transferAllowanceTo',
            gasBudget: '26344',
            ethereumAddress: '0xb82a77d6f89dae4611b81eac279fbf96d322001f',
            baseTokens: '0',
            nativeTokens: [],
            nfts: ['0xbf5b7cd4e8ac582e246c25b6a89b4ab4ef0646d3291aa03d9a5313154b714a06'],
        }
        const parsedMetadata = parseLayer2MetadataForTransfer(metadataByteArray)
        expect(parsedMetadata).toEqual(expected)
    })
})
