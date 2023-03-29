import { CoinType } from '@iota/wallet/out/types'

import { Converter, convertDateToUnixTimestamp } from '@core/utils'
import { activeProfileId } from '@core/profile/stores'
import { getLayer2MetadataForTransfer } from '@core/layer-2/actions'
import { addGasBudget } from '@core/layer-2/utils'

import { getOutputOptions } from '../utils'
import { ReturnStrategy, TokenStandard, VerifiedStatus } from '../enums'
import { IAsset, IPersistedAsset } from '../interfaces'
import { NewTransactionType } from '../stores'
import { NewTransactionDetails } from '../types'

const PERSISTED_ASSET_SHIMMER: IPersistedAsset = {
    id: CoinType[CoinType.Shimmer],
    standard: TokenStandard.BaseCoin,
    hidden: false,
    verification: { verified: true, status: VerifiedStatus.Official },
}
const tag = 'tag'
const metadata = 'metadata'
const expirationDate = new Date()
const recipientAddress = 'rms1qqqp07ychhkc3u68ueug0zqq9g0wtfgeatynr6ksm9jwud30rvlkyqnhpl5'
const senderAddress = 'rms1abcp07ychhkc3u68ueug0zqq9g0wtfgeatynr6ksm9jwud30rvlkyqnhdef'
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
    senderAddress,
}
const nftId = '0xcd9430ff870a22f81f92428e5c06975fa3ec1a993331aa3db9fb2298e931ade1'
const surplus = '50000'

const baseTransaction: NewTransactionDetails = {
    type: NewTransactionType.TokenTransfer,
    assetId: CoinType[CoinType.Shimmer],
    recipient: {
        type: 'address',
        address: recipientAddress,
    },
    rawAmount: amount,
    unit: 'glow',
}

jest.mock('../stores/persisted-assets.store', () => ({
    getPersistedAsset: jest.fn(() => PERSISTED_ASSET_SHIMMER),
    getAssetById: jest.fn((id) => (id === PERSISTED_ASSET_SHIMMER.id ? PERSISTED_ASSET_SHIMMER : nativeTokenAsset)),
}))

jest.mock('../actions/getAccountAssetsForSelectedAccount', () => ({
    getAccountAssetsForSelectedAccount: jest.fn((_) => {
        return {
            baseCoin: PERSISTED_ASSET_SHIMMER,
            nativeTokens: [nativeTokenAsset],
        }
    }),
}))

describe('File: getOutputOptions.ts', () => {
    let newTransactionDetails: NewTransactionDetails

    beforeAll(() => {
        // TODO: refactor getOutpuOptions to not rely on this store
        activeProfileId.set('id')
    })

    it('should return output options for base token with metadata and tag', () => {
        newTransactionDetails = {
            ...baseTransaction,
            metadata,
            tag,
        }
        const output = getOutputOptions(newTransactionDetails)

        const expectedOutput = {
            recipientAddress,
            amount,
            unlocks: {},
            features: { metadata: Converter.utf8ToHex(metadata, true), tag: Converter.utf8ToHex(tag, true) },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output options for base token with expiration date', () => {
        newTransactionDetails = {
            ...baseTransaction,
            expirationDate,
        }
        const output = getOutputOptions(newTransactionDetails)

        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { expirationUnixTime: convertDateToUnixTimestamp(expirationDate) },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output options for native token without surplus', () => {
        newTransactionDetails = {
            ...baseTransaction,
            expirationDate,
            assetId: nativeTokenAsset.id,
        }
        const output = getOutputOptions(newTransactionDetails)

        const expectedOutput = {
            recipientAddress,
            amount: '0',
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
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output options for base token to layer 2', () => {
        newTransactionDetails = {
            ...baseTransaction,
            expirationDate,
            layer2Parameters,
        }
        const output = getOutputOptions(newTransactionDetails)

        const expectedOutput = {
            recipientAddress: layer2Parameters.networkAddress,
            amount: addGasBudget(amount),
            features: {
                metadata: getLayer2MetadataForTransfer(newTransactionDetails),
                sender: senderAddress,
            },
            unlocks: { expirationUnixTime: convertDateToUnixTimestamp(expirationDate) },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output options for native token to layer 2', () => {
        newTransactionDetails = {
            ...baseTransaction,
            expirationDate,
            assetId: nativeTokenAsset.id,
            layer2Parameters,
        }
        const output = getOutputOptions(newTransactionDetails)

        const expectedOutput = {
            recipientAddress: layer2Parameters.networkAddress,
            amount: addGasBudget('0'),
            assets: {
                nativeTokens: [
                    {
                        amount: '0x3b9aca00',
                        id: nativeTokenAsset.id,
                    },
                ],
            },
            features: { metadata: getLayer2MetadataForTransfer(newTransactionDetails), sender: senderAddress },
            unlocks: { expirationUnixTime: convertDateToUnixTimestamp(expirationDate) },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output options for nft transfer', () => {
        newTransactionDetails = {
            type: NewTransactionType.NftTransfer,
            recipient: baseTransaction.recipient,
            nftId,
            expirationDate,
        }
        const output = getOutputOptions(newTransactionDetails)

        const expectedOutput = {
            recipientAddress,
            amount: '0',
            assets: {
                nftId,
            },
            features: {},
            unlocks: { expirationUnixTime: convertDateToUnixTimestamp(expirationDate) },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output options for native token with surplus', () => {
        newTransactionDetails = {
            ...baseTransaction,
            expirationDate,
            assetId: nativeTokenAsset.id,
            surplus,
        }
        const output = getOutputOptions(newTransactionDetails)

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
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output options for base token with surplus', () => {
        newTransactionDetails = {
            ...baseTransaction,
            expirationDate,
            surplus,
        }
        const output = getOutputOptions(newTransactionDetails)

        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { expirationUnixTime: convertDateToUnixTimestamp(expirationDate) },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output options for transfer with gifted storage deposit', () => {
        newTransactionDetails = {
            ...baseTransaction,
            expirationDate,
            surplus,
            giftStorageDeposit: true,
        }
        const output = getOutputOptions(newTransactionDetails)

        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { expirationUnixTime: convertDateToUnixTimestamp(expirationDate) },
            storageDeposit: { returnStrategy: ReturnStrategy.Gift },
        }
        expect(output).toStrictEqual(expectedOutput)
    })
})
