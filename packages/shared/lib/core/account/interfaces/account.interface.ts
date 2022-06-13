import { IAliasOutput, IBasicOutput, IFoundryOutput, INftOutput, OutputTypes } from '@iota/types'
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
    PreparedTransactionData,
    OutputOptions,
} from '@iota/wallet/out/types'
import {
    BuildAliasOutputData,
    BuildBasicOutputData,
    BuildFoundryOutputData,
    BuildNftOutputData,
} from '@iota/wallet/out/types/buildOutputData'
import { SignedTransactionEssence } from '@iota/wallet/out/types/signedTransactionEssence'

export interface IAccount {
    meta: AccountMeta
    buildAliasOutput(data: BuildAliasOutputData): Promise<IAliasOutput>
    buildBasicOutput(data: BuildBasicOutputData): Promise<IBasicOutput>
    buildFoundryOutput(data: BuildFoundryOutputData): Promise<IFoundryOutput>
    buildNftOutput(data: BuildNftOutputData): Promise<INftOutput>
    collectOutputs(outputIds: string[]): Promise<TransactionResult[]>
    generateAddress(options?: AddressGenerationOptions): Promise<Address>
    generateAddresses(amount: number, options?: AddressGenerationOptions): Promise<Address[]>
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
    mintNativeToken(
        nativeTokenOptions: NativeTokenOptions,
        transferOptions?: TransactionOptions
    ): Promise<TransactionResult[]>
    mintNfts(nftOptions: NftOptions[], transferOptions?: TransactionOptions): Promise<TransactionResult[]>
    prepareOutput(options: OutputOptions, transactionOptions?: TransactionOptions): Promise<OutputData>
    prepareSendAmount(
        addressWithAmount: AddressWithAmount[],
        options?: TransactionOptions
    ): Promise<PreparedTransactionData>
    prepareTransaction(outputs: OutputTypes[], options?: TransactionOptions): Promise<PreparedTransactionData>
    sendAmount(
        addressesWithAmount: AddressWithAmount[],
        transactionOptions?: TransactionOptions
    ): Promise<TransactionResult>
    sendMicroTransaction(
        addressesWithMicroAmount: AddressWithMicroAmount[],
        transactionOptions?: TransactionOptions
    ): Promise<TransactionResult>
    sendNativeTokens(
        addressesNativeTokens: AddressNativeTokens[],
        transactionOptions?: TransactionOptions
    ): Promise<TransactionResult>
    sendNft(addressesAndNftIds: AddressNftId[], transactionOptions?: TransactionOptions): Promise<TransactionResult>
    sendOutputs(outputs: OutputTypes[], transactionOptions?: TransactionOptions): Promise<TransactionResult>
    setAlias(alias: string): Promise<void>
    signTransactionEssence(preparedTransactionData: PreparedTransactionData): Promise<SignedTransactionEssence>
    submitAndStoreTransaction(signedTransactionData: SignedTransactionEssence): Promise<TransactionResult>
    sync(options?: AccountSyncOptions): Promise<void>
    tryCollectOutputs(outputsToCollect: OutputsToCollect): Promise<TransactionResult>
}
