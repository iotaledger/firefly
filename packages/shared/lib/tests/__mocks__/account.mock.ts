import { AccountBalance, Address } from '@iota/wallet'
import { IAccount } from '../../core/account'
import { MOCK_ACCOUNT_BALANCE } from './accountBalance.mock'
import { MOCK_ADDRESS } from './address.mock'

export class AccountMock implements IAccount {
    meta = {
        index: 0,
        coinType: 0,
        alias: 'testAccount',
        publicAddresses: [],
        internalAddresses: [],
        addressesWithBalance: [],
        outputs: {},
        lockedOutputs: {},
        unspentOutputs: {},
        transactions: {},
        pendingTransactions: {},
        accountOptions: {
            outputConsolidationThreshold: 0,
            automaticOutputConsolidation: false,
        },
    }

    constructor() {}

    alias(): string {
        return ''
    }

    collectOutputs(): Promise<void> {
        return Promise.resolve()
    }

    getOutputsWithAdditionalUnlockConditions(outputs): Promise<string> {
        return Promise.resolve('')
    }

    listAddresses(): Promise<[]> {
        return Promise.resolve([])
    }

    listAddressesWithBalance(): Promise<[]> {
        return Promise.resolve([])
    }

    listOutputs(): Promise<[]> {
        return Promise.resolve([])
    }

    listUnspentOutputs(): Promise<[]> {
        return Promise.resolve([])
    }

    listPendingTransactions(): Promise<[]> {
        return Promise.resolve([])
    }

    listTransactions(): Promise<[]> {
        return Promise.resolve([])
    }

    sync(options?): Promise<void> {
        return Promise.resolve()
    }

    generateAddresses(): Promise<Address[]> {
        return Promise.resolve([MOCK_ADDRESS])
    }

    latestAddress(): Promise<Address> {
        return Promise.resolve(MOCK_ADDRESS)
    }

    balance(): Promise<AccountBalance> {
        return Promise.resolve(MOCK_ACCOUNT_BALANCE)
    }

    mintNativeToken(nativeTokenOptions, transferOptions): Promise<[]> {
        return Promise.resolve([])
    }

    mintNfts(nftOptions, transferOptions): Promise<[]> {
        return Promise.resolve([])
    }

    sendAmount(addressesWithAmount, transferOptions): Promise<[]> {
        return Promise.resolve([])
    }
    sendMicroTransaction(addressesWithMicroAmount, transferOptions): Promise<[]> {
        return Promise.resolve([])
    }

    sendNativeTokens(addressNativeTokens, transferOptions): Promise<[]> {
        return Promise.resolve([])
    }

    sendNft(addressesAndNftIds, transferOptions): Promise<[]> {
        return Promise.resolve([])
    }

    sendTransfer(outputs, transferOptions): Promise<[]> {
        return Promise.resolve([])
    }

    tryCollectOutputs(outputsToCollect): Promise<[]> {
        return Promise.resolve([])
    }

    setClientOptions(options): Promise<void> {
        return Promise.resolve()
    }
}
