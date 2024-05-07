import { activeProfileId } from '@core/profile/stores/active-profile-id.store'
import { NetworkId } from '@core/network/enums'

import { GAS_BUDGET } from '@core/layer-2/constants'

import { getOutputParameters } from '../utils'
import { ReturnStrategy, TokenStandard, VerifiedStatus } from '../enums'
import { IAsset, IPersistedAsset } from '../interfaces'
import { NewTransactionType } from '../stores'
import { NewTransactionDetails } from '../types'

const PERSISTED_ASSET_SHIMMER: IPersistedAsset = {
    id: '1',
    standard: TokenStandard.BaseToken,
    hidden: false,
    verification: { verified: true, status: VerifiedStatus.Official },
}
const tag = 'tag'
const metadata = 'metadata'
const expirationDate = new Date('2023-03-30T08:04:34.932Z')
const timelockDate = new Date('2023-03-15T08:04:34.932Z')
const recipientAddress = 'rms1qqqp07ychhkc3u68ueug0zqq9g0wtfgeatynr6ksm9jwud30rvlkyqnhpl5'
const senderAddress = 'rms1abcp07ychhkc3u68ueug0zqq9g0wtfgeatynr6ksm9jwud30rvlkyqnhdef'
const amount = '1000000000'
const nativeTokenAsset: IAsset = {
    id: '0x08cd4dcad7ccc383111942671ee8cdc487ddd250398331ca2692b8b1a81551a1c30100000000',
    chainId: 60,
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
    asset: PERSISTED_ASSET_SHIMMER,
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

jest.mock('../../profile-manager/api', () => ({
    api: {
        bech32ToHex: jest.fn((_) => '0x676642585b5148b14639782bf0c83960ff465b9aa7c161d5aad08910e3109020'),
    },
}))

jest.mock('../actions/getAccountAssetsForSelectedAccount', () => ({
    getAccountAssetsForSelectedAccount: jest.fn((_) => {
        return {
            [NetworkId.ShimmerTestnet]: {
                baseCoin: PERSISTED_ASSET_SHIMMER,
                nativeTokens: [nativeTokenAsset],
            },
        }
    }),
}))

jest.mock('../../profile/actions/active-profile/getCoinType', () => ({
    getCoinType: jest.fn((_) => '1'),
}))

jest.mock('../../layer-2/utils/getEstimatedGasForTransferFromTransactionDetails', () => ({
    getEstimatedGasForTransferFromTransactionDetails: jest.fn(() => GAS_BUDGET.toJSNumber()),
}))

describe('File: getOutputParameters.ts', () => {
    let newTransactionDetails: NewTransactionDetails

    beforeAll(() => {
        // TODO: refactor getOutputParameters to not rely on this store
        activeProfileId.set('id')
    })

    it('should return output parameters for base token with metadata and tag', async () => {
        newTransactionDetails = {
            ...baseTransaction,
            metadata,
            tag,
        }
        const output = await getOutputParameters(newTransactionDetails)

        const expectedOutput = {
            recipientAddress,
            amount,
            unlocks: {},
            features: { metadata: '0x6d65746164617461', tag: '0x746167' },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for base token with expiration date', async () => {
        newTransactionDetails = {
            ...baseTransaction,
            expirationDate,
        }
        const output = await getOutputParameters(newTransactionDetails)

        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for base token with timelock date', async () => {
        newTransactionDetails = {
            ...baseTransaction,
            timelockDate,
        }
        const output = await getOutputParameters(newTransactionDetails)

        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { timelockUnixTime: 1678867475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for base token with timelock and expiration date', async () => {
        newTransactionDetails = {
            ...baseTransaction,
            expirationDate,
            timelockDate,
        }
        const output = await getOutputParameters(newTransactionDetails)

        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { expirationUnixTime: 1680163475, timelockUnixTime: 1678867475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for native token without surplus', async () => {
        newTransactionDetails = {
            ...baseTransaction,
            expirationDate,
            asset: nativeTokenAsset,
        }
        const output = await getOutputParameters(newTransactionDetails)

        const expectedOutput = {
            recipientAddress,
            amount: '0',
            assets: {
                nativeTokens: [
                    {
                        amount: BigInt(1000000000),
                        id: nativeTokenAsset.id,
                    },
                ],
            },
            features: {},
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    xit('should return output parameters for base token to layer 2', async () => {
        newTransactionDetails = {
            ...baseTransaction,
            expirationDate,
            layer2Parameters,
        }
        const output = await getOutputParameters(newTransactionDetails)

        const expectedOutput = {
            recipientAddress: layer2Parameters.networkAddress,
            amount: (Number(GAS_BUDGET) + Number(amount)).toString(),
            features: {
                metadata:
                    '0x00025e4b3ca1e3f423a0c21e0101614003676642585b5148b14639782bf0c83960ff465b9aa7c161d5aad08910e310902000010000070c000c30680e00000090000f0ea000060009000d300000000000808094ebdc03',
                sender: senderAddress,
            },
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    xit('should return output parameters for native token to layer 2', async () => {
        newTransactionDetails = {
            ...baseTransaction,
            expirationDate,
            asset: nativeTokenAsset,
            layer2Parameters,
        }
        const output = await getOutputParameters(newTransactionDetails)

        const expectedOutput = {
            recipientAddress: layer2Parameters.networkAddress,
            amount: GAS_BUDGET.toString(),
            assets: {
                nativeTokens: [
                    {
                        amount: BigInt(1000000000),
                        id: nativeTokenAsset.id,
                    },
                ],
            },
            features: {
                metadata:
                    '0x00025e4b3ca1e3f423a0c21e0101614003676642585b5148b14639782bf0c83960ff465b9aa7c161d5aad08910e310902000010000070c000c30680e00000090000f0ea000060009000d300000000000400108cd4dcad7ccc383111942671ee8cdc487ddd250398331ca2692b8b1a81551a1c30100000000043b9aca00',
                sender: senderAddress,
            },
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    xit('should return output parameters for nft to layer 2', async () => {
        newTransactionDetails = {
            type: NewTransactionType.NftTransfer,
            recipient: baseTransaction.recipient,
            nftId,
            layer2Parameters,
        }
        const output = await getOutputParameters(newTransactionDetails)

        const expectedOutput = {
            recipientAddress: layer2Parameters.networkAddress,
            amount: GAS_BUDGET.toString(),
            assets: {
                nftId,
            },
            features: {
                metadata:
                    '0x00025e4b3ca1e3f423a0c21e0101614003676642585b5148b14639782bf0c83960ff465b9aa7c161d5aad08910e310902000010000070c000c30680e00000090000f0ea000060009000d3000000000002001cd9430ff870a22f81f92428e5c06975fa3ec1a993331aa3db9fb2298e931ade1',
                sender: senderAddress,
            },
            unlocks: {},
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for nft transfer', async () => {
        newTransactionDetails = {
            type: NewTransactionType.NftTransfer,
            recipient: baseTransaction.recipient,
            nftId,
            expirationDate,
        }
        const output = await getOutputParameters(newTransactionDetails)

        const expectedOutput = {
            recipientAddress,
            amount: '0',
            assets: {
                nftId,
            },
            features: {},
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for native token with surplus', async () => {
        newTransactionDetails = {
            ...baseTransaction,
            expirationDate,
            asset: nativeTokenAsset,
            surplus,
        }
        const output = await getOutputParameters(newTransactionDetails)

        const expectedOutput = {
            recipientAddress,
            amount: surplus,
            assets: {
                nativeTokens: [
                    {
                        amount: BigInt(1000000000),
                        id: nativeTokenAsset.id,
                    },
                ],
            },
            features: {},
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for base token with surplus', async () => {
        newTransactionDetails = {
            ...baseTransaction,
            expirationDate,
            surplus,
        }
        const output = await getOutputParameters(newTransactionDetails)

        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Return },
        }
        expect(output).toStrictEqual(expectedOutput)
    })

    it('should return output parameters for transfer with gifted storage deposit', async () => {
        newTransactionDetails = {
            ...baseTransaction,
            expirationDate,
            surplus,
            giftStorageDeposit: true,
        }
        const output = await getOutputParameters(newTransactionDetails)

        const expectedOutput = {
            recipientAddress,
            amount,
            features: {},
            unlocks: { expirationUnixTime: 1680163475 },
            storageDeposit: { returnStrategy: ReturnStrategy.Gift },
        }
        expect(output).toStrictEqual(expectedOutput)
    })
})
