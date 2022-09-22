import type {
    IAliasOutput,
    IBasicOutput,
    IFoundryOutput,
    INftOutput,
    IOutputResponse,
    ITransactionPayload,
    OutputTypes,
} from '@iota/types'
import {
    AccountBalance,
    Address,
    AddressNativeTokens,
    AddressNftId,
    AddressWithAmount,
    AddressWithMicroAmount,
    BuildAliasOutputData,
    BuildBasicOutputData,
    BuildFoundryOutputData,
    BuildNftOutputData,
    FilterOptions,
    IncreaseNativeTokenSupplyOptions,
    MintTokenTransaction,
    OutputData,
    OutputOptions,
    PreparedTransactionData,
    SignedTransactionEssence,
    Transaction,
    TransactionOptions,
} from '@iota/wallet'

import { IAccount } from '../../core/account'

import { MOCK_ACCOUNT_BALANCE } from './account-balance.mock'
import { MOCK_ADDRESS } from './address.mock'

export class AccountMock implements IAccount {
    meta = {
        index: 0,
        coinType: 0,
        alias: 'testAccount',
        publicAddresses: [],
        internalAddresses: [],
        addressesWithUnspentOutputs: [],
        outputs: {},
        lockedOutputs: new Set<string>(),
        unspentOutputs: {},
        transactions: {},
        incomingTransactions: {},
        pendingTransactions: new Set<string>(),
        accountOptions: {
            outputConsolidationThreshold: 0,
            automaticOutputConsolidation: false,
        },
    }

    constructor() {}

    buildAliasOutput(data: BuildAliasOutputData): Promise<IAliasOutput> {
        throw new Error('Method not implemented.')
    }

    buildBasicOutput(data: BuildBasicOutputData): Promise<IBasicOutput> {
        throw new Error('Method not implemented.')
    }

    buildFoundryOutput(data: BuildFoundryOutputData): Promise<IFoundryOutput> {
        throw new Error('Method not implemented.')
    }

    buildNftOutput(data: BuildNftOutputData): Promise<INftOutput> {
        throw new Error('Method not implemented.')
    }

    burnNativeToken(
        tokenId: string,
        burnAmount: string,
        transactionOptions?: TransactionOptions | undefined
    ): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    burnNft(nftId: string, transactionOptions?: TransactionOptions | undefined): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    consolidateOutputs(force: boolean, outputConsolidationThreshold?: number): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    claimOutputs(): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    decreaseNativeTokenSupply(
        tokenId: string,
        meltAmount: string,
        transactionOptions?: TransactionOptions | undefined
    ): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }
    destroyAlias(aliasId: string, transactionOptions?: TransactionOptions | undefined): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }
    destroyFoundry(foundryId: string, transactionOptions?: TransactionOptions | undefined): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    getBalance(): Promise<AccountBalance> {
        return Promise.resolve(MOCK_ACCOUNT_BALANCE)
    }

    getFoundryOutput(tokenId: string): Promise<IFoundryOutput> {
        throw new Error('Method not implemented.')
    }

    getMetadata(): string {
        return ''
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

    getOutputsWithAdditionalUnlockConditions(outputs): Promise<string[]> {
        return Promise.resolve([''])
    }

    increaseNativeTokenSupply(
        tokenId: string,
        mintAmount: string,
        increaseNativeTokenSupplyOptions?: IncreaseNativeTokenSupplyOptions | undefined,
        transactionOptions?: TransactionOptions | undefined
    ): Promise<MintTokenTransaction> {
        throw new Error('Method not implemented.')
    }

    listAddresses(): Promise<[]> {
        return Promise.resolve([])
    }

    listAddressesWithUnspentOutputs(): Promise<[]> {
        return Promise.resolve([])
    }

    listOutputs(filterOptions?: FilterOptions): Promise<[]> {
        return Promise.resolve([])
    }

    listIncomingTransactions(): Promise<[string, ITransactionPayload, IOutputResponse][]> {
        throw new Error('Method not implemented.')
    }

    listUnspentOutputs(filterOptions?: FilterOptions): Promise<[]> {
        return Promise.resolve([])
    }

    listPendingTransactions(): Promise<[]> {
        return Promise.resolve([])
    }

    listTransactions(): Promise<[]> {
        return Promise.resolve([])
    }

    minimumRequiredStorageDeposit(outputs: OutputTypes[]): Promise<string> {
        throw new Error('Method not implemented.')
    }

    prepareSendAmount(
        addressWithAmount: AddressWithAmount[],
        options?: TransactionOptions
    ): Promise<PreparedTransactionData> {
        throw new Error('Method not implemented.')
    }

    prepareTransaction(outputs: OutputTypes[], options?: TransactionOptions): Promise<PreparedTransactionData> {
        throw new Error('Method not implemented.')
    }

    generateAddress(): Promise<Address> {
        return Promise.resolve(MOCK_ADDRESS)
    }

    generateAddresses(): Promise<Address[]> {
        return Promise.resolve([MOCK_ADDRESS])
    }

    mintNativeToken(nativeTokenOptions, transferOptions): Promise<MintTokenTransaction> {
        throw new Error('Method not implemented.')
    }

    mintNfts(nftOptions, transferOptions): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    prepareOutput(options: OutputOptions, transactionOptions?: TransactionOptions): Promise<OutputTypes> {
        throw new Error('Method not implemented.')
    }

    getTransaction(transactionId: string): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    sendAmount(
        addressesWithAmount: AddressWithAmount[],
        transactionOptions?: TransactionOptions
    ): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    sendMicroTransaction(
        addressesWithMicroAmount: AddressWithMicroAmount[],
        transactionOptions?: TransactionOptions
    ): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    sendNativeTokens(
        addressesNativeTokens: AddressNativeTokens[],
        transactionOptions?: TransactionOptions
    ): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    sendNft(addressesAndNftIds: AddressNftId[], transactionOptions?: TransactionOptions): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    sendOutputs(outputs: OutputTypes[], transactionOptions?: TransactionOptions): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    setAlias(alias: string): Promise<void> {
        throw new Error('Method not implemented.')
    }

    signTransactionEssence(preparedTransactionData: PreparedTransactionData): Promise<SignedTransactionEssence> {
        throw new Error('Method not implemented.')
    }

    submitAndStoreTransaction(signedTransactionData: SignedTransactionEssence): Promise<Transaction> {
        throw new Error('Method not implemented.')
    }

    sync(options?): Promise<AccountBalance> {
        throw new Error('Method not implemented.')
    }
}
