import { OutputTypes } from '@iota/types'
import {
    AccountBalance,
    AccountMeta,
    AccountSyncOptions,
    Address,
    AddressGenerationOptions,
    AddressNativeTokens,
    AddressNftId,
    AddressWithAmount,
    AddressWithMicroAmount,
    AddressWithUnspentOutputs,
    NativeTokenOptions,
    NftOptions,
    OutputData,
    OutputsToCollect,
    Transaction,
    TransactionResult,
    TransactionOptions,
    OutputOptions,
} from '@iota/wallet/out/types'

export interface IAccount {
    meta: AccountMeta
    collectOutputs(outputIds: string[]): Promise<TransactionResult[]>
    getAlias(): string
    getBalance(): Promise<AccountBalance>
    getOutput(outputId: string): Promise<OutputData>
    getOutputsWithAdditionalUnlockConditions(outputs: OutputsToCollect): Promise<string>
    getTransaction(transactionId: string): Promise<Transaction>
    listAddresses(): Promise<Address[]>
    listAddressesWithUnspentOutputs(): Promise<AddressWithUnspentOutputs[]>
    listOutputs(): Promise<OutputData[]>
    listUnspentOutputs(): Promise<OutputData[]>
    listPendingTransactions(): Promise<Transaction[]>
    listTransactions(): Promise<Transaction[]>
    sync(options?: AccountSyncOptions): Promise<void>
    generateAddress(options?: AddressGenerationOptions): Promise<Address>
    generateAddresses(amount: number, options?: AddressGenerationOptions): Promise<Address[]>
    mintNativeToken(
        nativeTokenOptions: NativeTokenOptions,
        transferOptions?: TransactionOptions
    ): Promise<TransactionResult[]>
    mintNfts(nftOptions: NftOptions[], transferOptions?: TransactionOptions): Promise<TransactionResult[]>
    prepareOutput(options: OutputOptions, transactionOptions?: TransactionOptions): Promise<OutputData>
    sendAmount(
        addressesWithAmount: AddressWithAmount[],
        transferOptions?: TransactionOptions
    ): Promise<TransactionResult>
    sendMicroTransaction(
        addressesWithMicroAmount: AddressWithMicroAmount[],
        transferOptions?: TransactionOptions
    ): Promise<TransactionResult>
    sendNativeTokens(
        addressesNativeTokens: AddressNativeTokens[],
        transferOptions?: TransactionOptions
    ): Promise<TransactionResult>
    sendNft(addressesAndNftIds: AddressNftId[], transferOptions?: TransactionOptions): Promise<TransactionResult>
    sendTransfer(outputs: OutputData[], transferOptions?: TransactionOptions): Promise<TransactionResult>
    tryCollectOutputs(outputsToCollect: OutputsToCollect): Promise<TransactionResult>
}
