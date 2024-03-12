import { Address, Client, SecretManager } from '@iota/sdk'
import {
    AccountId,
    FoundryId,
    HexEncodedString,
    NftId,
    Output,
    OutputId,
    SecretManagerType,
    TransactionId,
    WalletOptions,
    Bech32Address,
    ProtocolParameters,
    DecayedMana,
    DelegationId,
} from '@iota/sdk/out/types'
import { IWallet } from '@core/profile/interfaces'

export interface IApi {
    getClientFromWallet(id: string): Promise<Client>
    createSecretManager(options: SecretManagerType): Promise<SecretManager>
    createWallet(id: string, payload: WalletOptions): Promise<IWallet>
    deleteWallet(id: string): Promise<void>
    getWallet(id: string, walletOptions: WalletOptions): Promise<IWallet>
    clearWalletsFromMemory(): Promise<void>
    migrateStrongholdSnapshotV2ToV3(
        currentPath: string,
        currentPassword: string,
        newPath: string,
        newPassword: string
    ): Promise<void>
    migrateDbChrysalisToStardust(path: string, pinCode: string): Promise<Record<string, unknown>>
    // Mapped from sdk#Utils
    slotIndexCreated: number
    outputManaWithDecay(
        output: Output,
        slotIndexCreated: number,
        slotIndexTarget: number,
        protocolParameters: ProtocolParameters
    ): DecayedMana
    generateMnemonic(): string
    verifyMnemonic(mnemonic: string): void
    addressToBech32(address: Address, bech32Hrp: string): Bech32Address
    parseBech32Address(bech32: Bech32Address): HexEncodedString
    computeAccountId(outputId: string): AccountId
    computeFoundryId(accountId: AccountId, serialNumber: number, tokenSchemeType: number): FoundryId
    computeNftId(outputId: string): NftId
    computeOutputId(id: TransactionId, index: number): OutputId
    computeDelegationId(outputId: OutputId): DelegationId
    outputHexBytes(output: Output): HexEncodedString
}
