import { FeatureTypes, UnlockConditionTypes } from '@iota/types'
import { IWrappedOutput } from '../../wallet/interfaces'
import { buildNftFromNftOutput } from '../utils/buildNftFromNftOutput'
import { Converter } from '../../utils/convert'
import { Bech32Helper } from '../../utils/crypto'

const accountAddress = 'rms1qr47ee0fhahukrzec088v9lngv7w5k2sn3jjtwvkcpjfgxhhsazlsurxrx9'

const outputId = '0x16cc2007c1f0120b4832f89950ac5099f804c9730f54c4c1865f485b7b12a7870000'
const type = 6
const amount = '68900'
const nftId = '0xd17971b9baf1b80356bcc42715447acd01fb6aadb7ebfa8d0af2b07f911325a0'

const immutableFeatures: FeatureTypes[] = [
    {
        type: 1,
        address: {
            type: 0,
            pubKeyHash: '0x20dceb927cfdc2cea642fbf77aed81f42400145b5a4fd906f1aa40af1c31afb1',
        },
    },
    {
        type: 2,
        data: '0x7b227374616e64617264223a224952433237222c2276657273696f6e223a2276312e30222c226e616d65223a227364617364222c2274797065223a22696d6167652f706e67222c22757269223a2268747470733a2f2f697066732e696f2f697066732f516d51717a4d546176516754346634543576365057427037584e4b746f506d43396a766e313257505433676b5345227d',
    },
]

const incomingUnlockConditions: UnlockConditionTypes[] = [
    {
        type: 0,
        address: {
            type: 0,
            pubKeyHash: '0xebece5e9bf6fcb0c59c3ce7617f3433cea59509c6525b996c064941af78745f8',
        },
    },
]

const incomingTimelockedCondition: UnlockConditionTypes[] = [
    {
        type: 0,
        address: {
            type: 0,
            pubKeyHash: '0xebece5e9bf6fcb0c59c3ce7617f3433cea59509c6525b996c064941af78745f8',
        },
    },
    {
        type: 2,
        unixTime: 2876367917,
    },
]

const incomingExpiredTimelockedCondition: UnlockConditionTypes[] = [
    {
        type: 0,
        address: {
            type: 0,
            pubKeyHash: '0xebece5e9bf6fcb0c59c3ce7617f3433cea59509c6525b996c064941af78745f8',
        },
    },
    {
        type: 2,
        unixTime: 136367917,
    },
]

jest.mock('../../wallet/utils/convertHexAddressToBech32.ts', () => ({
    convertHexAddressToBech32: jest.fn((addressType: number, hexAddress: string) => {
        return hexAddress ? Bech32Helper.toBech32(addressType, Converter.hexToBytes(hexAddress), 'rms') : undefined
    }),
}))

describe('File: buildNFtFromOutput.ts', () => {
    let outputData: IWrappedOutput

    it('should classify default nft as spendable', () => {
        outputData = {
            outputId,
            output: {
                type,
                nftId,
                amount,
                unlockConditions: incomingUnlockConditions,
                immutableFeatures,
            },
        }
        let nft = buildNftFromNftOutput(outputData, accountAddress, true)
        expect(nft.isSpendable).toBe(true)
    })

    it('should correctly classify nft as timelocked', () => {
        outputData = {
            outputId,
            output: {
                type,
                nftId,
                amount,
                unlockConditions: incomingTimelockedCondition,
                immutableFeatures,
            },
        }
        const nft = buildNftFromNftOutput(outputData, accountAddress)
        expect(nft.isSpendable).toBe(true)
        expect(nft.timelockTime).toBe(2876367917000)
    })

    it('should correctly classify expired timelocked nft', () => {
        outputData = {
            outputId,
            output: {
                type,
                nftId,
                amount,
                unlockConditions: incomingExpiredTimelockedCondition,
                immutableFeatures,
            },
        }
        const nft = buildNftFromNftOutput(outputData, accountAddress)
        expect(nft.isSpendable).toBe(true)
        expect(nft.timelockTime).toBe(136367917000)
    })

    it('should ignore parsing spendable state and timelock', () => {
        outputData = {
            outputId,
            output: {
                type,
                nftId,
                amount,
                unlockConditions: incomingUnlockConditions,
            },
        }
        let nft = buildNftFromNftOutput(outputData, accountAddress, false)
        expect(nft.isSpendable).toBe(false)
        expect(nft.timelockTime).toBe(undefined)

        outputData = {
            outputId,
            output: {
                type,
                nftId,
                amount,
                unlockConditions: incomingTimelockedCondition,
            },
        }
        nft = buildNftFromNftOutput(outputData, accountAddress, false)
        expect(nft.isSpendable).toBe(false)
        expect(nft.timelockTime).toBe(undefined)

        outputData = {
            outputId,
            output: {
                type,
                nftId,
                amount,
                unlockConditions: incomingExpiredTimelockedCondition,
                immutableFeatures,
            },
        }
        nft = buildNftFromNftOutput(outputData, accountAddress, false)
        expect(nft.isSpendable).toBe(false)
        expect(nft.timelockTime).toBe(undefined)
    })

    it('should parse the metadata correctly', () => {
        outputData = {
            outputId,
            output: {
                type,
                nftId,
                amount,
                unlockConditions: incomingUnlockConditions,
                immutableFeatures,
            },
        }
        let nft = buildNftFromNftOutput(outputData, accountAddress)

        let expectedParsedMetadata = {
            standard: 'IRC27',
            version: 'v1.0',
            type: 'image/png',
            uri: 'https://ipfs.io/ipfs/QmQqzMTavQgT4f4T5v6PWBp7XNKtoPmC9jvn12WPT3gkSE',
            name: 'sdasd',
            collectionName: undefined,
            description: undefined,
            issuerName: undefined,
            royalties: undefined,
        }
        expect(nft.parsedMetadata).toStrictEqual(expectedParsedMetadata)
    })
})
