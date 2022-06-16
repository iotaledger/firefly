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
    BuildAliasOutputData,
    BuildBasicOutputData,
    BuildFoundryOutputData,
    BuildNftOutputData,
    NativeTokenOptions,
    NftOptions,
    OutputData,
    OutputsToCollect,
    SignedTransactionEssence,
    Transaction,
    TransactionResult,
    TransactionOptions,
    PreparedTransactionData,
    OutputOptions,
} from '@iota/wallet'

export interface IAccount {
    meta: AccountMeta
    buildAliasOutput(data: BuildAliasOutputData): Promise<IAliasOutput>
    buildBasicOutput(data: BuildBasicOutputData): Promise<IBasicOutput>
    buildFoundryOutput(data: BuildFoundryOutputData): Promise<IFoundryOutput>
    buildNftOutput(data: BuildNftOutputData): Promise<INftOutput>
    collectOutputs(outputIds: string[]): Promise<TransactionResult[]>
    consolidateOutputs(force: boolean, outputConsolidationThreshold?: number): Promise<TransactionResult[]>
    generateAddress(options?: AddressGenerationOptions): Promise<Address>
    generateAddresses(amount: number, options?: AddressGenerationOptions): Promise<Address[]>
    getAlias(): string
    getBalance(): Promise<AccountBalance>
    getOutput(outputId: string): Promise<OutputData>
    getOutputsWithAdditionalUnlockConditions(outputs: OutputsToCollect): Promise<string[]>
    getTransaction(transactionId: string): Promise<Transaction>
    listAddresses(): Promise<Address[]>
    listAddressesWithUnspentOutputs(): Promise<AddressWithUnspentOutputs[]>
    listOutputs(): Promise<OutputData[]>
    listPendingTransactions(): Promise<Transaction[]>
    listTransactions(): Promise<Transaction[]>
    listUnspentOutputs(): Promise<OutputData[]>
    minimumRequiredStorageDeposit(outputs: OutputTypes[]): Promise<string>
    mintNativeToken(
        nativeTokenOptions: NativeTokenOptions,
        transactionOptions?: TransactionOptions
    ): Promise<TransactionResult>
    mintNfts(nftsOptions: NftOptions[], transactionOptions?: TransactionOptions): Promise<TransactionResult>
    prepareOutput(options: OutputOptions, transactionOptions?: TransactionOptions): Promise<OutputTypes>
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
    sync(options?: AccountSyncOptions): Promise<AccountBalance>
    tryCollectOutputs(outputsToCollect: OutputsToCollect): Promise<TransactionResult[]>
}
