import { AccountBalance, Address, OutputData, TransactionReceipt } from '@iota/wallet'
import { IAccount } from '../../core/account'
import { IAccountBalances } from '../../core/account/interfaces/account-balances.interface'
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

    getAlias(): string {
        return ''
    }

    getBalance(): Promise<IAccountBalances> {
        return Promise.resolve({
            aliases: [],
            available: 12,
            foundries: [],
            nativeToken: {},
            nfts: [],
            potentiallLockedOutputs: [],
            requiredStorageDeposit: 100,
            total: 200,
        })
    }

    collectOutputs(): Promise<TransactionReceipt[]> {
        return Promise.resolve([])
    }

    getOutput(outputId: string): Promise<OutputData> {
        return undefined
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

    getOutputsWithAdditionalUnlockConditions(outputs): Promise<string> {
        return Promise.resolve('')
    }

    listAddresses(): Promise<[]> {
        return Promise.resolve([])
    }

    listAddressesWithUnspentOutputs(): Promise<[]> {
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

    generateAddress(): Promise<Address> {
        return Promise.resolve(MOCK_ADDRESS)
    }

    generateAddresses(): Promise<Address[]> {
        return Promise.resolve([MOCK_ADDRESS])
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
}
