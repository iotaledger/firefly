import {
    AccountBalance,
    AccountMeta,
    AccountSyncOptions,
    Address,
    AddressNativeTokens,
    AddressNftId,
    AddressWithAmount,
    AddressWithMicroAmount,
    ClientOptions,
    NativeTokenOptions,
    NftOptions,
    OutputData,
    OutputsToCollect,
    Transaction,
    TransferOptions,
} from '@iota/wallet/out/types'

export interface IAccount {
    meta: AccountMeta
    alias(): string
    collectOutputs(): Promise<void>
    getOutputsWithAdditionalUnlockConditions(outputs): Promise<string>
    listAddresses(): Promise<Address[]>
    listAddressesWithBalance(): Promise<Address[]>
    listOutputs(): Promise<OutputData[]>
    listUnspentOutputs(): Promise<OutputData[]>
    listPendingTransactions(): Promise<Transaction[]>
    listTransactions(): Promise<Transaction[]>
    sync(options?: AccountSyncOptions): Promise<void>
    generateAddresses(): Promise<Address[]>
    latestAddress(): Promise<Address>
    balance(): Promise<AccountBalance>
    mintNativeToken(nativeTokenOptions: NativeTokenOptions, transferOptions: TransferOptions): Promise<Transaction[]>
    mintNfts(nftOptions: NftOptions, transferOptions: TransferOptions): Promise<Transaction[]>
    sendAmount(addressesWithAmount: AddressWithAmount[], transferOptions: TransferOptions): Promise<[]>
    sendMicroTransaction(
        addressesWithMicroAmount: AddressWithMicroAmount[],
        transferOptions: TransferOptions
    ): Promise<[]>
    sendNativeTokens(addressNativeTokens: AddressNativeTokens[], transferOptions: TransferOptions): Promise<[]>
    sendNft(addressesAndNftIds: AddressNftId[], transferOptions: TransferOptions): Promise<[]>
    sendTransfer(outputs: OutputData[], transferOptions: TransferOptions): Promise<[]>
    tryCollectOutputs(outputsToCollect: OutputsToCollect): Promise<[]>
    setClientOptions(options: ClientOptions): Promise<void>
}
