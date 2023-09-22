/* eslint-disable quotes */
import { Converter, HexHelper, WriteStream } from '@iota/util.js'
import bigInt from 'big-integer'

export function serializeOutput(object: IBasicOutput | INftOutput): string {
    const writeStream = new WriteStream()

    if (object.type === BASIC_OUTPUT_TYPE) {
        serializeBasicOutput(writeStream, object)
    } else if (object.type === NFT_OUTPUT_TYPE) {
        serializeNftOutput(writeStream, object)
    }

    const finalBytes = writeStream.finalBytes()
    return Converter.bytesToHex(finalBytes, true)
}

function serializeBasicOutput(writeStream: WriteStream, object: IBasicOutput): void {
    writeStream.writeUInt8('basicOutput.type', object.type)

    writeStream.writeUInt64('basicOutput.amount', bigInt(object.amount))
    serializeNativeTokens(writeStream, object.nativeTokens)
    serializeUnlockConditions(writeStream, object.unlockConditions)
    serializeFeatures(writeStream, object.features)
}

function serializeNftOutput(writeStream: WriteStream, object: INftOutput): void {
    writeStream.writeUInt8('nftOutput.type', object.type)

    writeStream.writeUInt64('nftOutput.amount', bigInt(object.amount))
    serializeNativeTokens(writeStream, object.nativeTokens)
    writeStream.writeFixedHex('nftOutput.nftId', NFT_ID_LENGTH, object.nftId)

    serializeUnlockConditions(writeStream, object.unlockConditions)
    serializeFeatures(writeStream, object.features)
    serializeFeatures(writeStream, object.immutableFeatures)
}

function serializeNativeTokens(writeStream: WriteStream, object: INativeToken[] | undefined): void {
    writeStream.writeUInt8('nativeTokens.numNativeTokens', object?.length ?? 0)

    if (!object) {
        return
    }

    for (let i = 0; i < object.length; i++) {
        serializeNativeToken(writeStream, object[i])
    }
}

// Native tokens

function serializeNativeToken(writeStream: WriteStream, object: INativeToken): void {
    writeStream.writeFixedHex('nativeToken.id', NATIVE_TOKEN_ID_LENGTH, object.id)
    writeStream.writeUInt256('nativeToken.amount', HexHelper.toBigInt256(object.amount))
}

function serializeUnlockConditions(writeStream: WriteStream, objects: UnlockConditionTypes[]): void {
    writeStream.writeUInt8('unlockConditions.numUnlockConditions', objects.length)

    for (let i = 0; i < objects.length; i++) {
        serializeUnlockCondition(writeStream, objects[i])
    }
}

// Unlock conditions

function serializeUnlockCondition(writeStream: WriteStream, object: ITypeBase<number>): void {
    if (object.type === ADDRESS_UNLOCK_CONDITION_TYPE) {
        serializeAddressUnlockCondition(writeStream, object as IAddressUnlockCondition)
    } else if (object.type === STORAGE_DEPOSIT_RETURN_UNLOCK_CONDITION_TYPE) {
        serializeStorageDepositReturnUnlockCondition(writeStream, object as IStorageDepositReturnUnlockCondition)
    } else if (object.type === TIMELOCK_UNLOCK_CONDITION_TYPE) {
        serializeTimelockUnlockCondition(writeStream, object as ITimelockUnlockCondition)
    } else if (object.type === EXPIRATION_UNLOCK_CONDITION_TYPE) {
        serializeExpirationUnlockCondition(writeStream, object as IExpirationUnlockCondition)
    } else if (object.type === STATE_CONTROLLER_ADDRESS_UNLOCK_CONDITION_TYPE) {
        serializeStateControllerAddressUnlockCondition(writeStream, object as IStateControllerAddressUnlockCondition)
    } else if (object.type === GOVERNOR_ADDRESS_UNLOCK_CONDITION_TYPE) {
        serializeGovernorAddressUnlockCondition(writeStream, object as IGovernorAddressUnlockCondition)
    } else if (object.type === IMMUTABLE_ALIAS_UNLOCK_CONDITION_TYPE) {
        serializeImmutableAliasUnlockCondition(writeStream, object as IImmutableAliasUnlockCondition)
    } else {
        throw new Error(`Unrecognized unlock condition type ${object.type}`)
    }
}

function serializeAddressUnlockCondition(writeStream: WriteStream, object: IAddressUnlockCondition): void {
    writeStream.writeUInt8('addressUnlockCondition.type', object.type)
    serializeAddress(writeStream, object.address)
}

function serializeExpirationUnlockCondition(writeStream: WriteStream, object: IExpirationUnlockCondition): void {
    writeStream.writeUInt8('expirationUnlockCondition.type', object.type)
    serializeAddress(writeStream, object.returnAddress)
    writeStream.writeUInt32('expirationUnlockCondition.unixTime', object.unixTime)
}

function serializeGovernorAddressUnlockCondition(
    writeStream: WriteStream,
    object: IGovernorAddressUnlockCondition
): void {
    writeStream.writeUInt8('governorUnlockCondition.type', object.type)
    serializeAddress(writeStream, object.address)
}

function serializeImmutableAliasUnlockCondition(
    writeStream: WriteStream,
    object: IImmutableAliasUnlockCondition
): void {
    writeStream.writeUInt8('immutableAliasUnlockCondition.type', object.type)
    serializeAddress(writeStream, object.address)
}

function serializeStateControllerAddressUnlockCondition(
    writeStream: WriteStream,
    object: IStateControllerAddressUnlockCondition
): void {
    writeStream.writeUInt8('stateControllerAddressUnlockCondition.type', object.type)
    serializeAddress(writeStream, object.address)
}

function serializeStorageDepositReturnUnlockCondition(
    writeStream: WriteStream,
    object: IStorageDepositReturnUnlockCondition
): void {
    writeStream.writeUInt8('storageDepositReturnUnlockCondition.type', object.type)
    serializeAddress(writeStream, object.returnAddress)
    writeStream.writeUInt64('storageDepositReturnUnlockCondition.amount', bigInt(object.amount))
}

function serializeTimelockUnlockCondition(writeStream: WriteStream, object: ITimelockUnlockCondition): void {
    writeStream.writeUInt8('timelockUnlockCondition.type', object.type)
    writeStream.writeUInt32('timelockUnlockCondition.unixTime', object.unixTime)
}

// Features

function serializeFeatures(writeStream: WriteStream, objects: FeatureTypes[] | undefined): void {
    writeStream.writeUInt8('features.numFeatures', objects?.length ?? 0)

    if (!objects) {
        return
    }

    for (let i = 0; i < objects.length; i++) {
        serializeFeature(writeStream, objects[i])
    }
}

function serializeFeature(writeStream: WriteStream, object: ITypeBase<number>): void {
    if (object.type === SENDER_FEATURE_TYPE) {
        serializeSenderFeature(writeStream, object as ISenderFeature)
    } else if (object.type === ISSUER_FEATURE_TYPE) {
        serializeIssuerFeature(writeStream, object as IIssuerFeature)
    } else if (object.type === METADATA_FEATURE_TYPE) {
        serializeMetadataFeature(writeStream, object as IMetadataFeature)
    } else if (object.type === TAG_FEATURE_TYPE) {
        serializeTagFeature(writeStream, object as ITagFeature)
    } else {
        throw new Error(`Unrecognized feature type ${object.type}`)
    }
}

function serializeIssuerFeature(writeStream: WriteStream, object: IIssuerFeature): void {
    writeStream.writeUInt8('issuerFeature.type', object.type)
    serializeAddress(writeStream, object.address)
}

function serializeMetadataFeature(writeStream: WriteStream, object: IMetadataFeature): void {
    writeStream.writeUInt8('metadataFeature.type', object.type)
    const data = HexHelper.stripPrefix(object.data)
    writeStream.writeUInt16('metadataFeature.dataLength', data.length / 2)
    writeStream.writeFixedHex('metadataFeature.data', data.length / 2, data)
}

function serializeSenderFeature(writeStream: WriteStream, object: ISenderFeature): void {
    writeStream.writeUInt8('senderFeature.type', object.type)
    serializeAddress(writeStream, object.address)
}

function serializeTagFeature(writeStream: WriteStream, object: ITagFeature): void {
    writeStream.writeUInt8('tagFeature.type', object.type)
    const tag = HexHelper.stripPrefix(object.tag)
    writeStream.writeUInt8('tagFeature.tagLength', tag.length / 2)
    writeStream.writeFixedHex('tagFeature.tag', tag.length / 2, tag)
}

// Addresses

function serializeAddress(writeStream: WriteStream, object: ITypeBase<number>): void {
    if (object.type === ED25519_ADDRESS_TYPE) {
        serializeEd25519Address(writeStream, object as IEd25519Address)
    } else if (object.type === ALIAS_ADDRESS_TYPE) {
        serializeAliasAddress(writeStream, object as IAliasAddress)
    } else if (object.type === NFT_ADDRESS_TYPE) {
        serializeNftAddress(writeStream, object as INftAddress)
    } else {
        throw new Error(`Unrecognized address type ${object.type}`)
    }
}

function serializeEd25519Address(writeStream: WriteStream, object: IEd25519Address): void {
    writeStream.writeUInt8('ed25519Address.type', object.type)
    writeStream.writeFixedHex('ed25519Address.pubKeyHash', 32, object.pubKeyHash)
}

function serializeAliasAddress(writeStream: WriteStream, object: IAliasAddress): void {
    writeStream.writeUInt8('aliasAddress.type', object.type)
    writeStream.writeFixedHex('aliasAddress.aliasId', ALIAS_ID_LENGTH, object.aliasId)
}

function serializeNftAddress(writeStream: WriteStream, object: INftAddress): void {
    writeStream.writeUInt8('nftAddress.type', object.type)
    writeStream.writeFixedHex('nftAddress.nftId', NFT_ID_LENGTH, object.nftId)
}

// Models

type HexEncodedString = string
type HexEncodedAmount = string

interface ITypeBase<T> {
    type: T
}

interface ICommonOutput {
    nativeTokens?: INativeToken[]
    unlockConditions: UnlockConditionTypes[]
    features?: FeatureTypes[]
}

export interface IBasicOutput extends ITypeBase<3>, ICommonOutput {
    amount: string
}

export interface INftOutput extends ITypeBase<6>, ICommonOutput {
    amount: string
    nftId: HexEncodedString
    immutableFeatures?: FeatureTypes[]
}

type UnlockConditionTypes =
    | IAddressUnlockCondition
    | IStorageDepositReturnUnlockCondition
    | ITimelockUnlockCondition
    | IExpirationUnlockCondition
    | IStateControllerAddressUnlockCondition
    | IGovernorAddressUnlockCondition
    | IImmutableAliasUnlockCondition

export interface IAddressUnlockCondition extends ITypeBase<0> {
    address: AddressTypes
}

export interface IExpirationUnlockCondition extends ITypeBase<3> {
    returnAddress: AddressTypes
    unixTime: number
}

interface IGovernorAddressUnlockCondition extends ITypeBase<5> {
    address: AddressTypes
}

interface IImmutableAliasUnlockCondition extends ITypeBase<6> {
    address: AddressTypes
}

interface IStateControllerAddressUnlockCondition extends ITypeBase<4> {
    address: AddressTypes
}

interface IStorageDepositReturnUnlockCondition extends ITypeBase<1> {
    returnAddress: AddressTypes
    amount: string
}

export interface ITimelockUnlockCondition extends ITypeBase<2> {
    unixTime: number
}

type FeatureTypes = ISenderFeature | IIssuerFeature | IMetadataFeature | ITagFeature

export interface ISenderFeature extends ITypeBase<0> {
    address: AddressTypes
}

interface IIssuerFeature extends ITypeBase<1> {
    address: AddressTypes
}

export interface IMetadataFeature extends ITypeBase<2> {
    data: HexEncodedString
}

export interface ITagFeature extends ITypeBase<3> {
    tag: HexEncodedString
}

type AddressTypes = IEd25519Address | IAliasAddress | INftAddress

interface IEd25519Address extends ITypeBase<0> {
    pubKeyHash: HexEncodedString
}

interface IAliasAddress extends ITypeBase<8> {
    aliasId: HexEncodedString
}

interface INftAddress extends ITypeBase<16> {
    nftId: HexEncodedString
}

interface INativeToken {
    id: string
    amount: HexEncodedAmount
}

const BASIC_OUTPUT_TYPE = 3
const NFT_OUTPUT_TYPE = 6
const NFT_ID_LENGTH: number = 32
const ALIAS_ID_LENGTH: number = 32
const UINT8_SIZE: number = 1
const UINT32_SIZE: number = 4
const SMALL_TYPE_LENGTH: number = UINT8_SIZE
const MIN_ALIAS_ADDRESS_LENGTH: number = SMALL_TYPE_LENGTH + ALIAS_ID_LENGTH
const FOUNDRY_ID_LENGTH: number = MIN_ALIAS_ADDRESS_LENGTH + UINT32_SIZE + UINT8_SIZE
const NATIVE_TOKEN_ID_LENGTH: number = FOUNDRY_ID_LENGTH
const ADDRESS_UNLOCK_CONDITION_TYPE = 0
const STORAGE_DEPOSIT_RETURN_UNLOCK_CONDITION_TYPE = 1
const TIMELOCK_UNLOCK_CONDITION_TYPE = 2
const EXPIRATION_UNLOCK_CONDITION_TYPE = 3
const STATE_CONTROLLER_ADDRESS_UNLOCK_CONDITION_TYPE = 4
const GOVERNOR_ADDRESS_UNLOCK_CONDITION_TYPE = 5
const IMMUTABLE_ALIAS_UNLOCK_CONDITION_TYPE = 6
const ED25519_ADDRESS_TYPE = 0
const ALIAS_ADDRESS_TYPE = 8
const NFT_ADDRESS_TYPE = 16
const ISSUER_FEATURE_TYPE = 1
const METADATA_FEATURE_TYPE = 2
const SENDER_FEATURE_TYPE = 0
const TAG_FEATURE_TYPE = 3
