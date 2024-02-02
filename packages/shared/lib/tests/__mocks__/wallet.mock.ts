import {
    Balance,
    SendNftParams,
    SendParams,
    ConsolidationParams,
    FilterOptions,
    INode,
    OutputData,
    OutputParams,
    OutputsToClaim,
    ParticipationEventRegistrationOptions,
    ParticipationEventStatus,
    ParticipationEventType,
    ParticipationEventWithNodes,
    ParticipationOverview,
    PreparedTransaction,
    PreparedTransactionData,
    TransactionOptions,
    SyncOptions,
    FoundryOutput,
    Output,
    PreparedCreateNativeTokenTransaction,
    Burn,
    TransactionWithMetadata,
    SendNativeTokenParams,
    SignedTransactionData,
} from '@iota/sdk/out/types'

import { IWallet } from '../../core/profile/interfaces'
import { MOCK_WALLET_BALANCE } from './wallet-balance.mock'

export class WalletMock implements Partial<IWallet> {
    public id: string

    constructor(id: string) {
        this.id = id
    }

    addresses(): Promise<[]> {
        return Promise.resolve([])
    }

    addressesWithUnspentOutputs(): Promise<[]> {
        return Promise.resolve([])
    }

    prepareBurnNativeToken(
        tokenId: string,
        burnAmount: bigint,
        transactionOptions?: TransactionOptions
    ): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareBurn(burn: Burn, transactionOptions?: TransactionOptions): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareBurnNft(nftId: string, transactionOptions?: TransactionOptions): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareConsolidateOutputs(params: ConsolidationParams): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    claimOutputs(outputIds: string[]): Promise<TransactionWithMetadata> {
        throw new Error('Method not implemented.')
    }

    prepareMeltNativeToken(
        tokenId: string,
        meltAmount: bigint,
        transactionOptions?: TransactionOptions
    ): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareDecreaseVotingPower(amount: string): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    deregisterParticipationEvent(eventId: string): Promise<void> {
        throw new Error('Method not implemented.')
    }

    prepareDestroyAlias(aliasId: string, transactionOptions?: TransactionOptions): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareDestroyFoundry(foundryId: string, transactionOptions?: TransactionOptions): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    getBalance(): Promise<Balance> {
        return Promise.resolve(MOCK_WALLET_BALANCE)
    }

    getIncomingTransaction(transactionId: string): Promise<TransactionWithMetadata> {
        throw new Error('Method not implemented.')
    }

    getFoundryOutput(tokenId: string): Promise<FoundryOutput> {
        throw new Error('Method not implemented.')
    }

    getOutput(outputId: string): Promise<OutputData> {
        throw new Error('Method not implemented.')
        // return Promise.resolve({
        //     outputId: '',
        //     outputResponse: {
        //         messageId: '0x2220425c84d8bf4c5e32170b7041ed1784576b31e0334db30f82355367170acf',
        //         transactionId: '0xde579578237d8a41a2a2bb3c58f2bcea3182e4cd2f36e8817dd95d0720b61bfb',
        //         outputIndex: 1,
        //         isSpent: true,
        //         milestoneIndexSpent: 151957,
        //         milestoneTimestampSpent: 1652776064,
        //         transactionIdSpent: '0x3158002b4c706134271afb530ee6d7a24d835819af2c3b536a59b401f931d106',
        //         milestoneIndexBooked: 151950,
        //         milestoneTimestampBooked: 1652775994,
        //         ledgerIndex: 152080,
        //         output: {
        //             type: "Basic",
        //             output: {}
        //         }
        //     },
        //     output: {
        //         type: "Basic",
        //         output: {}
        //     },
        //     amount: 998000000,
        //     isSpent: true,
        //     address: {
        //       type: 'Ed25519',
        //       data: '0x388725b58c207872778d2b6ea58d38e5077ab7cd231f14f7889446a0bd80d67c'
        //     },
        //     networkId: 1020014395361784300,
        //     remainder: true,
        // })
    }

    claimableOutputs(outputs: OutputsToClaim): Promise<string[]> {
        return Promise.resolve([''])
    }

    getParticipationEvent(eventId: string): Promise<ParticipationEventWithNodes> {
        throw new Error('Method not implemented.')
    }

    getParticipationEventIds(node: INode, eventType?: ParticipationEventType): Promise<string[]> {
        throw new Error('Method not implemented.')
    }

    getParticipationEvents(): Promise<{ [eventId: string]: ParticipationEventWithNodes }> {
        throw new Error('Method not implemented.')
    }

    getParticipationEventStatus(eventId: string): Promise<ParticipationEventStatus> {
        throw new Error('Method not implemented.')
    }

    getParticipationOverview(): Promise<ParticipationOverview> {
        throw new Error('Method not implemented.')
    }

    incomingTransactions(): Promise<TransactionWithMetadata[]> {
        throw new Error('Method not implemented.')
    }

    prepareMintNativeToken(
        tokenId: string,
        mintAmount: bigint,
        transactionOptions?: TransactionOptions
    ): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareIncreaseVotingPower(amount: string): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    outputs(filterOptions?: FilterOptions): Promise<OutputData[]> {
        return Promise.resolve([])
    }

    pendingTransactions(): Promise<TransactionWithMetadata[]> {
        return Promise.resolve([])
    }

    prepareSend(params: SendParams[], options?: TransactionOptions): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareTransaction(outputs: Output[], options?: TransactionOptions): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareCreateNativeToken(params, transferOptions): Promise<PreparedCreateNativeTokenTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareMintNfts(params, transferOptions): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareOutput(options: OutputParams, transactionOptions?: TransactionOptions): Promise<Output> {
        throw new Error('Method not implemented.')
    }

    getTransaction(transactionId: string): Promise<TransactionWithMetadata> {
        throw new Error('Method not implemented.')
    }

    registerParticipationEvents(
        options: ParticipationEventRegistrationOptions
    ): Promise<{ [eventId: string]: ParticipationEventWithNodes }> {
        throw new Error('Method not implemented.')
    }

    retryTransactionUntilIncluded(transactionId: string, interval?: number, maxAttempts?: number): Promise<string> {
        throw new Error('Method not implemented.')
    }

    setDefaultSyncOptions(options: SyncOptions): Promise<void> {
        throw new Error('Method not implemented.')
    }

    send(
        amount: bigint | string,
        address: string,
        transactionOptions?: TransactionOptions
    ): Promise<TransactionWithMetadata> {
        throw new Error('Method not implemented.')
    }

    sendWithParams(params: SendParams[], options?: TransactionOptions): Promise<TransactionWithMetadata> {
        throw new Error('Method not implemented.')
    }

    prepareSendNativeTokens(
        params: SendNativeTokenParams[],
        transactionOptions?: TransactionOptions
    ): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    prepareSendNft(params: SendNftParams[], transactionOptions?: TransactionOptions): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    sendOutputs(outputs: Output[], transactionOptions?: TransactionOptions): Promise<TransactionWithMetadata> {
        throw new Error('Method not implemented.')
    }

    setAlias(alias: string): Promise<void> {
        throw new Error('Method not implemented.')
    }

    prepareStopParticipating(eventId: string): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }

    signAndSubmitTransaction(preparedTransactionData: PreparedTransactionData): Promise<TransactionWithMetadata> {
        throw new Error('Method not implemented.')
    }

    submitAndStoreTransaction(signedTransactionData: SignedTransactionData): Promise<TransactionWithMetadata> {
        throw new Error('Method not implemented.')
    }

    sync(options?): Promise<Balance> {
        throw new Error('Method not implemented.')
    }

    transactions(): Promise<[]> {
        return Promise.resolve([])
    }

    unspentOutputs(filterOptions?: FilterOptions): Promise<[]> {
        return Promise.resolve([])
    }

    prepareVote(eventId?: string, answers?: number[]): Promise<PreparedTransaction> {
        throw new Error('Method not implemented.')
    }
}
