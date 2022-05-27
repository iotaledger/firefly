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
    TransactionReceipt,
    TransferOptions,
} from '@iota/wallet/out/types'

export interface IAccount {
    meta: AccountMeta
    collectOutputs(outputIds: string[]): Promise<TransactionReceipt[]>
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
        transferOptions?: TransferOptions
    ): Promise<TransactionReceipt[]>
    mintNfts(nftOptions: NftOptions[], transferOptions?: TransferOptions): Promise<TransactionReceipt[]>
    sendAmount(
        addressesWithAmount: AddressWithAmount[],
        transferOptions?: TransferOptions
    ): Promise<TransactionReceipt>
    sendMicroTransaction(
        addressesWithMicroAmount: AddressWithMicroAmount[],
        transferOptions?: TransferOptions
    ): Promise<TransactionReceipt>
    sendNativeTokens(
        addressesNativeTokens: AddressNativeTokens[],
        transferOptions?: TransferOptions
    ): Promise<TransactionReceipt>
    sendNft(addressesAndNftIds: AddressNftId[], transferOptions?: TransferOptions): Promise<TransactionReceipt>
    sendTransfer(outputs: OutputData[], transferOptions?: TransferOptions): Promise<TransactionReceipt>
    tryCollectOutputs(outputsToCollect: OutputsToCollect): Promise<TransactionReceipt>
}
