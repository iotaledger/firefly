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
    MintTokenTransaction,
    NativeTokenOptions,
    NftOptions,
    OutputData,
    OutputsToClaim,
    SignedTransactionEssence,
    Transaction,
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
    claimOutputs(outputIds: string[]): Promise<Transaction[]>
    consolidateOutputs(force: boolean, outputConsolidationThreshold?: number): Promise<Transaction[]>
    generateAddress(options?: AddressGenerationOptions): Promise<Address>
    generateAddresses(amount: number, options?: AddressGenerationOptions): Promise<Address[]>
    getAlias(): string
    getBalance(): Promise<AccountBalance>
    getFoundryOutput(tokenId: string): Promise<IFoundryOutput>
    getOutput(outputId: string): Promise<OutputData>
    getOutputsWithAdditionalUnlockConditions(outputs: OutputsToClaim): Promise<string[]>
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
    ): Promise<MintTokenTransaction>
    mintNfts(nftsOptions: NftOptions[], transactionOptions?: TransactionOptions): Promise<Transaction>
    prepareOutput(options: OutputOptions, transactionOptions?: TransactionOptions): Promise<OutputTypes>
    prepareSendAmount(
        addressWithAmount: AddressWithAmount[],
        options?: TransactionOptions
    ): Promise<PreparedTransactionData>
    prepareTransaction(outputs: OutputTypes[], options?: TransactionOptions): Promise<PreparedTransactionData>
    sendAmount(addressesWithAmount: AddressWithAmount[], transactionOptions?: TransactionOptions): Promise<Transaction>
    sendMicroTransaction(
        addressesWithMicroAmount: AddressWithMicroAmount[],
        transactionOptions?: TransactionOptions
    ): Promise<Transaction>
    sendNativeTokens(
        addressesNativeTokens: AddressNativeTokens[],
        transactionOptions?: TransactionOptions
    ): Promise<Transaction>
    sendNft(addressesAndNftIds: AddressNftId[], transactionOptions?: TransactionOptions): Promise<Transaction>
    sendOutputs(outputs: OutputTypes[], transactionOptions?: TransactionOptions): Promise<Transaction>
    setAlias(alias: string): Promise<void>
    signTransactionEssence(preparedTransactionData: PreparedTransactionData): Promise<SignedTransactionEssence>
    submitAndStoreTransaction(signedTransactionData: SignedTransactionEssence): Promise<Transaction>
    sync(options?: AccountSyncOptions): Promise<AccountBalance>
    tryClaimOutputs(outputsToClaim: OutputsToClaim): Promise<Transaction[]>
}
