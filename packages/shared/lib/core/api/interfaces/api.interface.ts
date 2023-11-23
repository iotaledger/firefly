import { IAccount } from '@core/account'
import { SecretManager } from '@iota/sdk'
import { AccountId, FoundryId, HexEncodedString, NftId, Output, OutputId, SecretManagerType, TransactionId, WalletOptions, Bech32Address } from '@iota/sdk/out/types'

// TODO(2.0): Every method should return a promise (maybe except Utils, needs research)
export interface IApi {
    createSecretManager(options: SecretManagerType): Promise<SecretManager>
    createAccount(id: string, payload: WalletOptions): Promise<IAccount>
    deleteWallet(id: string): void
    getAccount(id: string, walletOptions: WalletOptions): Promise<IAccount>
    clearWalletsFromMemory(): void
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
    hexToBech32(hex: HexEncodedString, bech32Hrp: string): Bech32Address
    bech32ToHex(bech32: Bech32Address): HexEncodedString
    computeAccountId(outputId: string): AccountId
    computeFoundryId(accountId: AccountId, serialNumber: number, tokenSchemeType: number): Promise<FoundryId>
    computeNftId(outputId: string): NftId
    hexPublicKeyToBech32Address(hex: HexEncodedString, bech32Hrp: string): Bech32Address
    accountIdToBech32(accountId: AccountId, bech32Hrp: string): Bech32Address
    nftIdToBech32(nftId: string, bech32Hrp: string): Bech32Address
    computeOutputId(id: TransactionId, index: number): Promise<OutputId>
    outputHexBytes(output: Output): Promise<HexEncodedString>
}
