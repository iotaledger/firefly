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
    TransferOptions,
} from '@iota/wallet/out/types'

export interface IAccount {
    meta: AccountMeta
    collectOutputs(outputIds: string[]): Promise<TransactionResult[]>
    getAlias(): string
    getBalance(): Promise<AccountBalance>
    getOutput(outputId: string): Promise<OutputData>
    getOutputsWithAdditionalUnlockConditions(outputs: OutputsToCollect): Promise<string>
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
    ): Promise<TransactionResult[]>
    mintNfts(nftOptions: NftOptions[], transferOptions?: TransferOptions): Promise<TransactionResult[]>
    sendAmount(
        addressesWithAmount: AddressWithAmount[],
        transferOptions?: TransferOptions
    ): Promise<TransactionResult[]>
    sendMicroTransaction(
        addressesWithMicroAmount: AddressWithMicroAmount[],
        transferOptions?: TransferOptions
    ): Promise<TransactionResult[]>
    sendNativeTokens(
        addressesNativeTokens: AddressNativeTokens[],
        transferOptions?: TransferOptions
    ): Promise<TransactionResult[]>
    sendNft(addressesAndNftIds: AddressNftId[], transferOptions?: TransferOptions): Promise<TransactionResult[]>
    sendTransfer(outputs: OutputData[], transferOptions?: TransferOptions): Promise<TransactionResult[]>
    tryCollectOutputs(outputsToCollect: OutputsToCollect): Promise<TransactionResult[]>
}
