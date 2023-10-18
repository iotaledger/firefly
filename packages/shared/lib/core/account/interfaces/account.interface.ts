import type {
    AccountMetadata,
    AddressWithUnspentOutputs,
    AliasOutputParams,
    Balance,
    CreateNativeTokenParams,
    ConsolidationParams,
    FilterOptions,
    GenerateAddressOptions,
    MintNftParams,
    OutputData,
    OutputParams,
    OutputsToClaim,
    ParticipationEventMap,
    ParticipationEventRegistrationOptions,
    ParticipationEventStatus,
    ParticipationEventWithNodes,
    ParticipationOverview,
    PreparedTransactionData,
    SendNativeTokensParams,
    SendNftParams,
    SendParams,
    SignedTransactionEssence,
    SyncOptions,
    Transaction,
    TransactionOptions,
    FoundryOutput,
    HexEncodedAmount,
    Output,
    INode,
    AccountAddress,
    PreparedTransaction,
    PreparedCreateNativeTokenTransaction,
    ParticipationEventType,
    ParticipationEventId,
    Burn,
} from '@iota/sdk/out/types'

export interface IAccount {
    addresses(): Promise<AccountAddress[]>
    addressesWithUnspentOutputs(): Promise<AddressWithUnspentOutputs[]>
    prepareBurn(burn: Burn, transactionOptions?: TransactionOptions): Promise<PreparedTransaction>
    prepareBurnNativeToken(
        tokenId: string,
        burnAmount: HexEncodedAmount,
        transactionOptions?: TransactionOptions
    ): Promise<PreparedTransaction>
    prepareBurnNft(nftId: string, transactionOptions?: TransactionOptions): Promise<PreparedTransaction>
    claimOutputs(outputIds: string[]): Promise<Transaction>
    prepareConsolidateOutputs(params: ConsolidationParams): Promise<PreparedTransaction>
    prepareCreateAliasOutput(
        params?: AliasOutputParams,
        transactionOptions?: TransactionOptions
    ): Promise<PreparedTransaction>
    prepareMeltNativeToken(
        tokenId: string,
        meltAmount: HexEncodedAmount,
        transactionOptions?: TransactionOptions
    ): Promise<Transaction>
    prepareDecreaseVotingPower(amount: string): Promise<PreparedTransaction>
    deregisterParticipationEvent(eventId: string): Promise<void>
    prepareDestroyAlias(aliasId: string, transactionOptions?: TransactionOptions): Promise<PreparedTransaction>
    prepareDestroyFoundry(foundryId: string, transactionOptions?: TransactionOptions): Promise<PreparedTransaction>
    generateEd25519Addresses(amount: number, options?: GenerateAddressOptions): Promise<AccountAddress[]>
    getBalance(): Promise<Balance>
    getFoundryOutput(tokenId: string): Promise<FoundryOutput>
    getIncomingTransaction(transactionId: string): Promise<Transaction>
    getMetadata(): AccountMetadata
    getOutput(outputId: string): Promise<OutputData>
    claimableOutputs(outputs: OutputsToClaim): Promise<string[]>
    getParticipationEvent(eventId: string): Promise<ParticipationEventWithNodes>
    getParticipationEventIds(node: INode, eventType?: ParticipationEventType): Promise<ParticipationEventId[]>
    getParticipationEvents(): Promise<ParticipationEventMap>
    getParticipationEventStatus(eventId: string): Promise<ParticipationEventStatus>
    getParticipationOverview(eventIds?: string[]): Promise<ParticipationOverview>
    getTransaction(transactionId: string): Promise<Transaction>
    incomingTransactions(): Promise<Transaction[]>
    prepareMintNativeToken(
        tokenId: string,
        mintAmount: HexEncodedAmount,
        transactionOptions?: TransactionOptions
    ): Promise<PreparedTransaction>
    prepareIncreaseVotingPower(amount: string): Promise<PreparedTransaction>
    prepareCreateNativeToken(
        params: CreateNativeTokenParams,
        transactionOptions?: TransactionOptions
    ): Promise<PreparedCreateNativeTokenTransaction>
    prepareMintNfts(params: MintNftParams[], transactionOptions?: TransactionOptions): Promise<PreparedTransaction>
    outputs(filterOptions?: FilterOptions): Promise<OutputData[]>
    prepareOutput(params: OutputParams, transactionOptions?: TransactionOptions): Promise<Output>
    pendingTransactions(): Promise<Transaction[]>
    prepareSend(params: SendParams[], options?: TransactionOptions): Promise<PreparedTransaction>
    prepareTransaction(outputs: Output[], options?: TransactionOptions): Promise<PreparedTransaction>
    registerParticipationEvents(options: ParticipationEventRegistrationOptions): Promise<ParticipationEventMap>
    retryTransactionUntilIncluded(transactionId: string, interval?: number, maxAttempts?: number): Promise<string>
    send(amount: bigint | string, address: string, transactionOptions?: TransactionOptions): Promise<Transaction>
    sendWithParams(params: SendParams[], transactionOptions?: TransactionOptions): Promise<Transaction>
    prepareSendNativeTokens(
        params: SendNativeTokensParams[],
        transactionOptions?: TransactionOptions
    ): Promise<PreparedTransaction>
    prepareSendNft(params: SendNftParams[], transactionOptions?: TransactionOptions): Promise<PreparedTransaction>
    sendOutputs(outputs: Output[], transactionOptions?: TransactionOptions): Promise<Transaction>
    setAlias(alias: string): Promise<void>
    setDefaultSyncOptions(options: SyncOptions): Promise<void>
    signTransactionEssence(preparedTransactionData: PreparedTransactionData): Promise<SignedTransactionEssence>
    prepareStopParticipating(eventId: string): Promise<PreparedTransaction>
    signAndSubmitTransaction(preparedTransactionData: PreparedTransactionData): Promise<Transaction>
    submitAndStoreTransaction(signedTransactionData: SignedTransactionEssence): Promise<Transaction>
    sync(options?: SyncOptions): Promise<Balance>
    transactions(): Promise<Transaction[]>
    unspentOutputs(filterOptions?: FilterOptions): Promise<OutputData[]>
    prepareVote(eventId?: string, answers?: number[]): Promise<PreparedTransaction>
}
