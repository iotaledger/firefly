import { plainToInstance } from 'class-transformer'
import { IWrappedOutput } from '../../wallet/interfaces'
import { DEFAULT_METADATA_FEATURE_ENTRY_KEY } from '../../wallet/constants'
import { buildNftFromNftOutput } from '../utils/buildNftFromNftOutput'
import {
    AddressUnlockCondition,
    Ed25519Address,
    IssuerFeature,
    MetadataFeature,
    NftOutputBuilderParams,
    TimelockUnlockCondition,
} from '@iota/sdk/out/types'
import { Address, AddressType, NftOutput } from '@iota/sdk/out/types'

const accountAddress = 'rms1qr47ee0fhahukrzec088v9lngv7w5k2sn3jjtwvkcpjfgxhhsazlsurxrx9'

const outputId = '0x16cc2007c1f0120b4832f89950ac5099f804c9730f54c4c1865f485b7b12a7870000'
const amount = '68900'
const nftId = '0xd17971b9baf1b80356bcc42715447acd01fb6aadb7ebfa8d0af2b07f911325a0'

function buildImmutableFeatures() {
    return [
        new IssuerFeature(new Ed25519Address('0x20dceb927cfdc2cea642fbf77aed81f42400145b5a4fd906f1aa40af1c31afb1')),
        new MetadataFeature({
            [DEFAULT_METADATA_FEATURE_ENTRY_KEY]:
                '0x7b227374616e64617264223a224952433237222c2276657273696f6e223a2276312e30222c226e616d65223a227364617364222c2274797065223a22696d6167652f706e67222c22757269223a2268747470733a2f2f697066732e696f2f697066732f516d51717a4d546176516754346634543576365057427037584e4b746f506d43396a766e313257505433676b5345227d',
        }),
    ]
}

function buildIncomingUnlockConditions() {
    return [
        new AddressUnlockCondition(
            new Ed25519Address('0xebece5e9bf6fcb0c59c3ce7617f3433cea59509c6525b996c064941af78745f8')
        ),
    ]
}

function buildIncomingTimelockedCondition() {
    return [
        new AddressUnlockCondition(
            new Ed25519Address('0xebece5e9bf6fcb0c59c3ce7617f3433cea59509c6525b996c064941af78745f8')
        ),
        new TimelockUnlockCondition(2876367917),
    ]
}

function buildIncomingExpiredTimelockedCondition() {
    return [
        new AddressUnlockCondition(
            new Ed25519Address('0xebece5e9bf6fcb0c59c3ce7617f3433cea59509c6525b996c064941af78745f8')
        ),
        new TimelockUnlockCondition(136367917),
    ]
}

function buildNftOutput(params: NftOutputBuilderParams) {
    return plainToInstance(NftOutput, {
        nftId: params.nftId,
        amount: params.amount,
        nativeTokens: params.nativeTokens,
        unlockConditions: params.unlockConditions,
        features: params.features,
        immutableFeatures: params.immutableFeatures,
    })
}

// we can't use api (preload) or Utils, so we hardcode the function mock test specific
jest.mock('../../../../lib/core/wallet/utils/getBech32AddressFromAddressTypes.ts', () => ({
    getBech32AddressFromAddressTypes: jest.fn((address: Address) => {
        switch (address.type) {
            case AddressType.Ed25519:
                return accountAddress
            case AddressType.Account:
                return undefined
            case AddressType.Nft:
                return undefined
        }
    }),
}))

describe('File: buildNftFromOutput.ts', () => {
    let outputData: IWrappedOutput

    xit('should classify default nft as spendable', () => {
        outputData = {
            outputId,
            output: buildNftOutput({
                amount,
                nftId,
                unlockConditions: buildIncomingUnlockConditions(),
                immutableFeatures: buildImmutableFeatures(),
            }),
        }

        let nft = buildNftFromNftOutput(outputData, accountAddress, true)
        expect(nft.isSpendable).toBe(true)
    })

    xit('should correctly classify nft as timelocked', () => {
        outputData = {
            outputId,
            output: buildNftOutput({
                amount,
                nftId,
                unlockConditions: buildIncomingTimelockedCondition(),
                immutableFeatures: buildImmutableFeatures(),
            }),
        }
        const nft = buildNftFromNftOutput(outputData, accountAddress)
        expect(nft.isSpendable).toBe(true)
        expect(nft.timelockTime).toBe(2876367917000)
    })

    xit('should correctly classify expired timelocked nft', () => {
        outputData = {
            outputId,
            output: buildNftOutput({
                amount,
                nftId,
                unlockConditions: buildIncomingExpiredTimelockedCondition(),
                immutableFeatures: buildImmutableFeatures(),
            }),
        }
        const nft = buildNftFromNftOutput(outputData, accountAddress)
        expect(nft.isSpendable).toBe(true)
        expect(nft.timelockTime).toBe(136367917000)
    })

    xit('should ignore parsing spendable state and timelock', () => {
        let outputData = {
            outputId,
            output: buildNftOutput({
                amount,
                nftId,
                unlockConditions: buildIncomingUnlockConditions(),
            }),
        }

        let nft = buildNftFromNftOutput(outputData, accountAddress, false)
        expect(nft.isSpendable).toBe(false)
        expect(nft.timelockTime).toBe(undefined)

        outputData = {
            outputId,
            output: buildNftOutput({
                amount,
                nftId,
                unlockConditions: buildIncomingTimelockedCondition(),
            }),
        }
        nft = buildNftFromNftOutput(outputData, accountAddress, false)
        expect(nft.isSpendable).toBe(false)
        expect(nft.timelockTime).toBe(undefined)

        outputData = {
            outputId,
            output: buildNftOutput({
                amount,
                nftId,
                unlockConditions: buildIncomingExpiredTimelockedCondition(),
                immutableFeatures: buildImmutableFeatures(),
            }),
        }

        nft = buildNftFromNftOutput(outputData, accountAddress, false)
        expect(nft.isSpendable).toBe(false)
        expect(nft.timelockTime).toBe(undefined)
    })

    xit('should parse the metadata correctly', () => {
        outputData = {
            outputId,
            output: buildNftOutput({
                amount,
                nftId,
                unlockConditions: buildIncomingUnlockConditions(),
                immutableFeatures: buildImmutableFeatures(),
            }),
        }

        const nft = buildNftFromNftOutput(outputData, accountAddress)

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
