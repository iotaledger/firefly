import type { HexEncodedAmount, IAliasOutput, IBasicOutput, IFoundryOutput, INftOutput, OutputTypes } from '@iota/types'
import type {
    AccountBalance,
    AccountMetadata,
    SyncOptions,
    Address,
    AddressGenerationOptions,
    AddressNativeTokens,
    AddressNftId,
    AddressWithAmount,
    AddressWithMicroAmount,
    AddressWithUnspentOutputs,
    AliasOutputOptions,
    BuildAliasOutputData,
    BuildBasicOutputData,
    BuildFoundryOutputData,
    BuildNftOutputData,
    FilterOptions,
    IncreaseNativeTokenSupplyOptions,
    MintTokenTransaction,
    NativeTokenOptions,
    NftOptions,
    Node,
    OutputData,
    OutputOptions,
    OutputsToClaim,
    ParticipationEventWithNodes,
    ParticipationEventStatus,
    ParticipationEventType,
    ParticipationOverview,
    PreparedTransactionData,
    SignedTransactionEssence,
    Transaction,
    TransactionOptions,
    ParticipationEventRegistrationOptions,
    ParticipationEventMap,
} from '@iota/wallet'

export interface IAccount {
    addresses(): Promise<Address[]>
    addressesWithUnspentOutputs(): Promise<AddressWithUnspentOutputs[]>
    buildAliasOutput(data: BuildAliasOutputData): Promise<IAliasOutput>
    buildBasicOutput(data: BuildBasicOutputData): Promise<IBasicOutput>
    buildFoundryOutput(data: BuildFoundryOutputData): Promise<IFoundryOutput>
    buildNftOutput(data: BuildNftOutputData): Promise<INftOutput>
    burnNativeToken(
        tokenId: string,
        burnAmount: HexEncodedAmount,
        transactionOptions?: TransactionOptions
    ): Promise<Transaction>
    burnNft(nftId: string, transactionOptions?: TransactionOptions): Promise<Transaction>
    claimOutputs(outputIds: string[]): Promise<Transaction>
    consolidateOutputs(force: boolean, outputConsolidationThreshold?: number): Promise<Transaction>
    createAliasOutput(
        aliasOutputOptions?: AliasOutputOptions,
        transactionOptions?: TransactionOptions
    ): Promise<Transaction>
    decreaseNativeTokenSupply(
        tokenId: string,
        meltAmount: HexEncodedAmount,
        transactionOptions?: TransactionOptions
    ): Promise<Transaction>
    decreaseVotingPower(amount: string): Promise<Transaction>
    deregisterParticipationEvent(eventId: string): Promise<void>
    destroyAlias(aliasId: string, transactionOptions?: TransactionOptions): Promise<Transaction>
    destroyFoundry(foundryId: string, transactionOptions?: TransactionOptions): Promise<Transaction>
    generateAddress(options?: AddressGenerationOptions): Promise<Address>
    generateAddresses(amount: number, options?: AddressGenerationOptions): Promise<Address[]>
    getBalance(): Promise<AccountBalance>
    getFoundryOutput(tokenId: string): Promise<IFoundryOutput>
    getMetadata(): AccountMetadata
    getOutput(outputId: string): Promise<OutputData>
    getOutputsWithAdditionalUnlockConditions(outputs: OutputsToClaim): Promise<string[]>
    getParticipationEvent(eventId: string): Promise<ParticipationEventWithNodes>
    getParticipationEventIds(node: Node, eventType?: ParticipationEventType): Promise<string[]>
    getParticipationEvents(): Promise<{ [eventId: string]: ParticipationEventWithNodes }>
    getParticipationEventStatus(eventId: string): Promise<ParticipationEventStatus>
    getParticipationOverview(): Promise<ParticipationOverview>
    getTransaction(transactionId: string): Promise<Transaction>
    getVotingPower(): Promise<string>
    incomingTransactions(): Promise<[string, Transaction][]>
    increaseNativeTokenSupply(
        tokenId: string,
        mintAmount: HexEncodedAmount,
        increaseNativeTokenSupplyOptions?: IncreaseNativeTokenSupplyOptions,
        transactionOptions?: TransactionOptions
    ): Promise<MintTokenTransaction>
    increaseVotingPower(amount: string): Promise<Transaction>
    minimumRequiredStorageDeposit(outputs: OutputTypes[]): Promise<string>
    mintNativeToken(
        nativeTokenOptions: NativeTokenOptions,
        transactionOptions?: TransactionOptions
    ): Promise<MintTokenTransaction>
    mintNfts(nftsOptions: NftOptions[], transactionOptions?: TransactionOptions): Promise<Transaction>
    outputs(filterOptions?: FilterOptions): Promise<OutputData[]>
    prepareOutput(options: OutputOptions, transactionOptions?: TransactionOptions): Promise<OutputTypes>
    pendingTransactions(): Promise<Transaction[]>
    prepareSendAmount(
        addressWithAmount: AddressWithAmount[],
        options?: TransactionOptions
    ): Promise<PreparedTransactionData>
    prepareTransaction(outputs: OutputTypes[], options?: TransactionOptions): Promise<PreparedTransactionData>
    registerParticipationEvents(options: ParticipationEventRegistrationOptions): Promise<ParticipationEventMap>
    retryTransactionUntilIncluded(
        transactionId: string,
        interval?: number,
        maxAttempts?: number
    ): Promise<PreparedTransactionData>
    requestFundsFromFaucet(url: string, address: string): Promise<string>
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
    stopParticipating(eventId: string): Promise<Transaction>
    submitAndStoreTransaction(signedTransactionData: SignedTransactionEssence): Promise<Transaction>
    sync(options?: SyncOptions): Promise<AccountBalance>
    transactions(): Promise<Transaction[]>
    unspentOutputs(filterOptions?: FilterOptions): Promise<OutputData[]>
    vote(eventId?: string, answers?: number[]): Promise<Transaction>
}
