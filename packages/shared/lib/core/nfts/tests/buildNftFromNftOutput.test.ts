import { IWrappedOutput } from '../../wallet/interfaces'
import { buildNftFromNftOutput } from '../utils/buildNftFromNftOutput'
import {
    AddressUnlockCondition,
    Ed25519Address,
    Feature,
    IssuerFeature,
    MetadataFeature,
    TimelockUnlockCondition,
    UnlockCondition,
} from '@iota/sdk/out/types'
import { Address, AddressType, AliasAddress, NftAddress } from '@iota/sdk/out/types'
import { Client, Utils } from '@iota/sdk'

const accountAddress = 'rms1qr47ee0fhahukrzec088v9lngv7w5k2sn3jjtwvkcpjfgxhhsazlsurxrx9'

const outputId = '0x16cc2007c1f0120b4832f89950ac5099f804c9730f54c4c1865f485b7b12a7870000'
const amount = '68900'
const nftId = '0xd17971b9baf1b80356bcc42715447acd01fb6aadb7ebfa8d0af2b07f911325a0'

const immutableFeatures: Feature[] = [
    new IssuerFeature(new Ed25519Address('0x20dceb927cfdc2cea642fbf77aed81f42400145b5a4fd906f1aa40af1c31afb1')),
    new MetadataFeature(
        '0x7b227374616e64617264223a224952433237222c2276657273696f6e223a2276312e30222c226e616d65223a227364617364222c2274797065223a22696d6167652f706e67222c22757269223a2268747470733a2f2f697066732e696f2f697066732f516d51717a4d546176516754346634543576365057427037584e4b746f506d43396a766e313257505433676b5345227d'
    ),
]

const incomingUnlockConditions: UnlockCondition[] = [
    new AddressUnlockCondition(
        new Ed25519Address('0xebece5e9bf6fcb0c59c3ce7617f3433cea59509c6525b996c064941af78745f8')
    ),
]

const incomingTimelockedCondition: UnlockCondition[] = [
    new AddressUnlockCondition(
        new Ed25519Address('0xebece5e9bf6fcb0c59c3ce7617f3433cea59509c6525b996c064941af78745f8')
    ),
    new TimelockUnlockCondition(2876367917),
]

const incomingExpiredTimelockedCondition: UnlockCondition[] = [
    new AddressUnlockCondition(
        new Ed25519Address('0xebece5e9bf6fcb0c59c3ce7617f3433cea59509c6525b996c064941af78745f8')
    ),
    new TimelockUnlockCondition(136367917),
]

// i think that we need to mock this function as api won't work in tests (contextBridge) but
// we can use Utils directly here without breaking the build
jest.mock('../../../../lib/core/wallet/utils/getBech32AddressFromAddressTypes.ts', () => ({
    getBech32AddressFromAddressTypes: jest.fn((address: Address) => {
        switch (address.type) {
            case AddressType.Ed25519:
                return Utils.hexToBech32((address as Ed25519Address).pubKeyHash, 'rms')
            case AddressType.Alias:
                return Utils.aliasIdToBech32((address as AliasAddress).aliasId, 'rms')
            case AddressType.Nft:
                return Utils.nftIdToBech32((address as NftAddress).nftId, 'rms')
        }
    }),
}))

describe('File: buildNftFromOutput.ts', () => {
    let outputData: IWrappedOutput
    let client: Client = new Client({})

    it('should classify default nft as spendable', async () => {
        const nftOutput = await client.buildNftOutput({
            amount,
            nftId,
            unlockConditions: incomingUnlockConditions,
            immutableFeatures,
        })

        outputData = {
            outputId,
            output: nftOutput,
        }

        let nft = buildNftFromNftOutput(outputData, accountAddress, true)
        expect(nft.isSpendable).toBe(true)
    })

    it('should correctly classify nft as timelocked', async () => {
        const nftOutput = await client.buildNftOutput({
            amount,
            nftId,
            unlockConditions: incomingTimelockedCondition,
            immutableFeatures,
        })

        outputData = {
            outputId,
            output: nftOutput,
        }
        const nft = buildNftFromNftOutput(outputData, accountAddress)
        expect(nft.isSpendable).toBe(true)
        expect(nft.timelockTime).toBe(2876367917000)
    })

    it('should correctly classify expired timelocked nft', async () => {
        const nftOutput = await client.buildNftOutput({
            amount,
            nftId,
            unlockConditions: incomingExpiredTimelockedCondition,
            immutableFeatures,
        })

        outputData = {
            outputId,
            output: nftOutput,
        }
        const nft = buildNftFromNftOutput(outputData, accountAddress)
        expect(nft.isSpendable).toBe(true)
        expect(nft.timelockTime).toBe(136367917000)
    })

    it('should ignore parsing spendable state and timelock', async () => {
        let nftOutput = await client.buildNftOutput({
            amount,
            nftId,
            unlockConditions: incomingUnlockConditions,
        })

        outputData = {
            outputId,
            output: nftOutput,
        }

        let nft = buildNftFromNftOutput(outputData, accountAddress, false)
        expect(nft.isSpendable).toBe(false)
        expect(nft.timelockTime).toBe(undefined)

        nftOutput = await client.buildNftOutput({
            amount,
            nftId,
            unlockConditions: incomingTimelockedCondition,
        })

        outputData = {
            outputId,
            output: nftOutput,
        }
        nft = buildNftFromNftOutput(outputData, accountAddress, false)
        expect(nft.isSpendable).toBe(false)
        expect(nft.timelockTime).toBe(undefined)

        nftOutput = await client.buildNftOutput({
            amount,
            nftId,
            unlockConditions: incomingExpiredTimelockedCondition,
            immutableFeatures,
        })

        outputData = {
            outputId,
            output: nftOutput,
        }
        nft = buildNftFromNftOutput(outputData, accountAddress, false)
        expect(nft.isSpendable).toBe(false)
        expect(nft.timelockTime).toBe(undefined)
    })

    it('should parse the metadata correctly', async () => {
        let nftOutput = await client.buildNftOutput({
            amount,
            nftId,
            unlockConditions: incomingUnlockConditions,
            immutableFeatures,
        })

        outputData = {
            outputId,
            output: nftOutput,
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
