import type {
    AccountMetadata,
    Address,
    AddressWithUnspentOutputs,
    AliasOutputParams,
    Balance,
    CreateNativeTokenParams,
    CreateNativeTokenTransaction,
    ConsolidationParams,
    Ed25519Signature,
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
    Secp256k1EcdsaSignature,
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
    HexEncodedString,
    INode,
    AccountAddress,
    PreparedTransaction,
    PreparedCreateNativeTokenTransaction,
} from '@iota/wallet/out/types'

import { ParticipationEventType } from '@iota/wallet/out/types'

export interface IAccount {
    addresses(): Promise<AccountAddress[]>
    addressesWithUnspentOutputs(): Promise<AddressWithUnspentOutputs[]>
    burnNativeToken(
        tokenId: string,
        burnAmount: HexEncodedAmount,
        transactionOptions?: TransactionOptions
    ): Promise<Transaction>
    burnNft(nftId: string, transactionOptions?: TransactionOptions): Promise<Transaction>
    claimOutputs(outputIds: string[]): Promise<Transaction>
    consolidateOutputs(params: ConsolidationParams): Promise<Transaction>
    prepareCreateAliasOutput(
        params?: AliasOutputParams,
        transactionOptions?: TransactionOptions
    ): Promise<PreparedTransaction>
    meltNativeToken(
        tokenId: string,
        meltAmount: HexEncodedAmount,
        transactionOptions?: TransactionOptions
    ): Promise<Transaction>
    decreaseVotingPower(amount: string): Promise<Transaction>
    deregisterParticipationEvent(eventId: string): Promise<void>
    destroyAlias(aliasId: string, transactionOptions?: TransactionOptions): Promise<Transaction>
    destroyFoundry(foundryId: string, transactionOptions?: TransactionOptions): Promise<Transaction>
    generateEd25519Address(options?: GenerateAddressOptions): Promise<Address>
    generateEd25519Addresses(amount: number, options?: GenerateAddressOptions): Promise<Address[]>
    generateEvmAddresses(generateAddressesOptions: GenerateAddressOptions): Promise<string[]>
    getBalance(): Promise<Balance>
    getFoundryOutput(tokenId: string): Promise<FoundryOutput>
    getIncomingTransaction(transactionId: string): Promise<Transaction>
    getMetadata(): AccountMetadata
    getOutput(outputId: string): Promise<OutputData>
    claimableOutputs(outputs: OutputsToClaim): Promise<string[]>
    getParticipationEvent(eventId: string): Promise<ParticipationEventWithNodes>
    getParticipationEventIds(node: INode, eventType?: ParticipationEventType): Promise<string[]>
    getParticipationEvents(): Promise<{ [eventId: string]: ParticipationEventWithNodes }>
    getParticipationEventStatus(eventId: string): Promise<ParticipationEventStatus>
    getParticipationOverview(eventIds?: string[]): Promise<ParticipationOverview>
    getTransaction(transactionId: string): Promise<Transaction>
    incomingTransactions(): Promise<Transaction[]>
    mintNativeToken(
        tokenId: string,
        mintAmount: HexEncodedAmount,
        transactionOptions?: TransactionOptions
    ): Promise<CreateNativeTokenTransaction>
    increaseVotingPower(amount: string): Promise<Transaction>
    prepareCreateNativeToken(
        params: CreateNativeTokenParams,
        transactionOptions?: TransactionOptions
    ): Promise<PreparedCreateNativeTokenTransaction>
    prepareMintNfts(params: MintNftParams[], transactionOptions?: TransactionOptions): Promise<PreparedTransaction>
    outputs(filterOptions?: FilterOptions): Promise<OutputData[]>
    prepareOutput(params: OutputParams, transactionOptions?: TransactionOptions): Promise<Output>
    pendingTransactions(): Promise<Transaction[]>
    prepareSend(params: SendParams[], options?: TransactionOptions): Promise<PreparedTransactionData>
    prepareTransaction(outputs: Output[], options?: TransactionOptions): Promise<PreparedTransactionData>
    registerParticipationEvents(options: ParticipationEventRegistrationOptions): Promise<ParticipationEventMap>
    retryTransactionUntilIncluded(
        transactionId: string,
        interval?: number,
        maxAttempts?: number
    ): Promise<PreparedTransactionData>
    requestFundsFromFaucet(url: string, address: string): Promise<string>
    sendAmount(params: SendParams[], transactionOptions?: TransactionOptions): Promise<Transaction>
    sendNativeTokens(params: SendNativeTokensParams[], transactionOptions?: TransactionOptions): Promise<Transaction>
    sendNft(params: SendNftParams[], transactionOptions?: TransactionOptions): Promise<Transaction>
    sendOutputs(outputs: Output[], transactionOptions?: TransactionOptions): Promise<Transaction>
    setAlias(alias: string): Promise<void>
    setDefaultSyncOptions(options: SyncOptions): Promise<void>
    signSecp256k1Ecdsa(message: HexEncodedString, chain: number[]): Promise<Secp256k1EcdsaSignature>
    signTransactionEssence(preparedTransactionData: PreparedTransactionData): Promise<SignedTransactionEssence>
    stopParticipating(eventId: string): Promise<Transaction>
    submitAndStoreTransaction(signedTransactionData: SignedTransactionEssence): Promise<Transaction>
    sync(options?: SyncOptions): Promise<Balance>
    transactions(): Promise<Transaction[]>
    unspentOutputs(filterOptions?: FilterOptions): Promise<OutputData[]>
    vote(eventId?: string, answers?: number[]): Promise<Transaction>
    verifyEd25519Signature(signature: Ed25519Signature, message: HexEncodedString): Promise<boolean>
    verifySecp256k1EcdsaSignature(signature: Secp256k1EcdsaSignature, message: HexEncodedString): Promise<boolean>
}
