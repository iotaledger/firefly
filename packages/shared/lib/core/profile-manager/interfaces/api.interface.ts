import { WalletOptions, CreateAccountPayload, TransactionId, OutputId } from '@iota/sdk/out/types'
import {
    AliasId,
    Bip44,
    Client,
    Ed25519Signature,
    FoundryId,
    HexEncodedString,
    NftId,
    Output,
    SecretManagerMethodHandler,
    SecretManagerType,
} from '@iota/sdk'
import { IAuth } from '@core/network'
import { INodeInfoResponse } from '@core/network/interfaces'

import { IAccount } from '@core/account'

import { IProfileManager } from './profile-manager.interface'
import { RecoverAccountsPayload } from './recover-account-payload.interface'

export interface IApi {
    getNodeInfo(profileManagerId: string, url?: string, auth?: IAuth): Promise<INodeInfoResponse>
    createWallet(id: string, options: WalletOptions): Promise<IProfileManager>
    createAccount(managerId: string, payload: CreateAccountPayload): Promise<IAccount>
    deleteWallet(id: string): void
    getAccount(profileManagerId: string, index: number): Promise<IAccount>
    getAccounts(profileManagerId: string): Promise<IAccount[]>
    getClient(profileManagerId: string): Promise<Client>
    recoverAccounts(profileManagerId: string, payload: RecoverAccountsPayload): Promise<IAccount[]>
    migrateStrongholdSnapshotV2ToV3(
        currentPath: string,
        currentPassword: string,
        newPath: string,
        newPassword: string
    ): Promise<void>
    migrateDbChrysalisToStardust(path: string, pinCode: string): Promise<Record<string, unknown>>
    // Mapped from sdk#Utils
    generateMnemonic(): Promise<string>
    verifyMnemonic(mnemonic: string): Promise<void>
    hexToBech32(hex: string, bech32Hrp: string): string
    bech32ToHex(bech32: string): string
    computeAliasId(outputId: string): AliasId
    computeFoundryId(aliasId: AliasId, serialNumber: number, tokenSchemeType: number): Promise<FoundryId>
    computeNftId(outputId: string): NftId
    hexPublicKeyToBech32Address(hex: string, bech32Hrp: string): string
    aliasIdToBech32(aliasId: string, bech32Hrp: string): string
    nftIdToBech32(nftId: string, bech32Hrp: string): string
    computeOutputId(id: TransactionId, index: number): Promise<OutputId>
    outputHexBytes(output: Output): Promise<HexEncodedString>
    // Mapped from SecretManager
    signEd25519(
        options: SecretManagerType | SecretManagerMethodHandler,
        message: HexEncodedString,
        chain: Bip44
    ): Promise<Ed25519Signature>
}
