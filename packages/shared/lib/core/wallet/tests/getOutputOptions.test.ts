import { VerifiedStatus } from '../enums'
import { IAsset } from '../interfaces'
import { getOutputOptions } from '../utils'
import { Converter, convertDateToUnixTimestamp } from '@core/utils'
import { getLayer2MetadataForTransfer } from '@core/layer-2/actions'

describe('File: getOutputOptions.ts', () => {
    const tag = 'tag'
    const metadata = 'metadata'
    const expirationDate = new Date()
    const recipientAddress = 'rms1qqqp07ychhkc3u68ueug0zqq9g0wtfgeatynr6ksm9jwud30rvlkyqnhpl5'
    const amount = '1000000000'
    const nativeTokenAsset: IAsset = {
        id: '0x08cd4dcad7ccc383111942671ee8cdc487ddd250398331ca2692b8b1a81551a1c30100000000',
        standard: 'erc20',
        balance: {
            total: Number(amount),
        },
        hidden: false,
        verification: { verified: true, status: VerifiedStatus.SelfVerified },
    }

    const layer2Parameters = {
        networkAddress: 'rms1pp4kmrl9n9yy9n049x7kk8h4atm0tu76redhj5wrc2jsskk2vukwxvtgk9u',
    }
    const nftId = '0xcd9430ff870a22f81f92428e5c06975fa3ec1a993331aa3db9fb2298e931ade1'
    const surplus = '50000'

    it('should return output options for base token with metadata and tag', () => {
        // TODO: allow null expiration date -> maybe fixed with what's in my stack
        // @ts-ignore
        const output = getOutputOptions(null, recipientAddress, amount, metadata, tag)
        const expectedOutput = {
            recipientAddress,
            amount,
            unlocks: {},
            features: { metadata: Converter.utf8ToHex(metadata, true), tag: Converter.utf8ToHex(tag, true) },
            storageDeposit: { returnStrategy: 'Return' },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output options for base token with expiration date', () => {
        const output = getOutputOptions(expirationDate, recipientAddress, amount)
        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { expirationUnixTime: convertDateToUnixTimestamp(expirationDate) },
            storageDeposit: { returnStrategy: 'Return' },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output options for native token without surplus', () => {
        const output = getOutputOptions(
            expirationDate,
            recipientAddress,
            amount,
            undefined,
            undefined,
            nativeTokenAsset
        )
        const expectedOutput = {
            recipientAddress,
            amount: '0',
            assets: {
                nftI: [
                    {
                        amount: '0x3b9aca00',
                        id: nativeTokenAsset.id,
                    },
                ],
            },
            features: {},
            unlocks: { expirationUnixTime: convertDateToUnixTimestamp(expirationDate) },
            storageDeposit: { returnStrategy: 'Return' },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output options for base token to layer 2', () => {
        const output = getOutputOptions(
            expirationDate,
            recipientAddress,
            amount,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            layer2Parameters
        )
        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { expirationUnixTime: convertDateToUnixTimestamp(expirationDate) },
            storageDeposit: { returnStrategy: 'Return' },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output options for native token to layer 2', () => {
        const output = getOutputOptions(
            expirationDate,
            recipientAddress,
            amount,
            undefined,
            undefined,
            nativeTokenAsset,
            undefined,
            undefined,
            undefined,
            nftId
        )
        const expectedOutput = {
            recipientAddress,
            amount: '0',
            assets: {
                nftId,
            },
            features: { metadata: getLayer2MetadataForTransfer(recipientAddress) },
            unlocks: { expirationUnixTime: convertDateToUnixTimestamp(expirationDate) },
            storageDeposit: { returnStrategy: 'Return' },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output options for nft transfer', () => {
        // TODO: Correct amount when sending NFT
        const output = getOutputOptions(
            expirationDate,
            recipientAddress,
            '0',
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            nftId
        )
        const expectedOutput = {
            recipientAddress,
            amount: '0',
            assets: {
                nftId,
            },
            features: {},
            unlocks: { expirationUnixTime: convertDateToUnixTimestamp(expirationDate) },
            storageDeposit: { returnStrategy: 'Return' },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output options for native token with surplus', () => {
        const output = getOutputOptions(
            expirationDate,
            recipientAddress,
            amount,
            undefined,
            undefined,
            nativeTokenAsset,
            false,
            surplus
        )
        const expectedOutput = {
            recipientAddress,
            amount: surplus,
            assets: {
                nativeTokens: [
                    {
                        amount: '0x3b9aca00',
                        id: nativeTokenAsset.id,
                    },
                ],
            },
            features: {},
            unlocks: { expirationUnixTime: convertDateToUnixTimestamp(expirationDate) },
            storageDeposit: { returnStrategy: 'Return' },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output options for base token with surplus', () => {
        const output = getOutputOptions(
            expirationDate,
            recipientAddress,
            amount,
            undefined,
            undefined,
            undefined,
            false,
            surplus
        )
        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { expirationUnixTime: convertDateToUnixTimestamp(expirationDate) },
            storageDeposit: { returnStrategy: 'Return' },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output options for transfer with gifted storage deposit', () => {
        const output = getOutputOptions(expirationDate, recipientAddress, amount, undefined, undefined, undefined, true)
        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { expirationUnixTime: convertDateToUnixTimestamp(expirationDate) },
            storageDeposit: { returnStrategy: 'Gift' },
        }
        expect(output).toStrictEqual(expectedOutput)
    })
})
