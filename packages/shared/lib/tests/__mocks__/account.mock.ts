export default class Account {
    meta = {
        index: 0,
        coinType: 0,
        alias: '',
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

    private messageHandler = ''

    constructor() {
        console.log('constructor called!')
    }

    alias(): string {
        console.log('alias called!')
        return ''
    }

    collectOutputs(): Promise<void> {
        console.log('collectOutputs called!')
        return new Promise((resolve) => {
            resolve()
        })
    }

    getOutputsWithAdditionalUnlockConditions(outputs): Promise<string> {
        console.log('getOutputsWithAdditionalUnlockConditions called!')
        return new Promise((resolve) => {
            resolve('')
        })
    }

    listAddresses(): Promise<[]> {
        console.log('listAddresses called!')
        return new Promise((resolve) => {
            resolve([])
        })
    }

    listAddressesWithBalance(): Promise<[]> {
        console.log('listAddressesWithBalance called!')
        return new Promise((resolve) => {
            resolve([])
        })
    }

    listOutputs(): Promise<[]> {
        console.log('listOutputs called!')
        return new Promise((resolve) => {
            resolve([])
        })
    }

    listUnspentOutputs(): Promise<[]> {
        console.log('listUnspentOutputs called!')
        return new Promise((resolve) => {
            resolve([])
        })
    }

    listPendingTransactions(): Promise<[]> {
        console.log('listPendingTransactions called!')
        return new Promise((resolve) => {
            resolve([])
        })
    }

    listTransactions(): Promise<[]> {
        console.log('listTransactions called!')
        return new Promise((resolve) => {
            resolve([])
        })
    }

    sync(options?): Promise<void> {
        console.log('sync called!')
        return new Promise((resolve) => {
            resolve()
        })
    }

    getNodeInfo(url: string): Promise<void> {
        console.log('getNodeInfo called!')
        return new Promise((resolve) => {
            resolve()
        })
    }

    generateAddresses(): Promise<[]> {
        console.log('generateAddresses called!')
        return new Promise((resolve) => {
            resolve([])
        })
    }
    latestAddress(): Promise<void> {
        console.log('latestAddress called!')
        return new Promise((resolve) => {
            resolve()
        })
    }
    balance(): Promise<void> {
        console.log('balance called!')
        return new Promise((resolve) => {
            resolve()
        })
    }
    mintNativeToken(nativeTokenOptions, transferOptions): Promise<[]> {
        console.log('mintNativeToken called!')
        return new Promise((resolve) => {
            resolve([])
        })
    }

    mintNfts(nftOptions, transferOptions): Promise<[]> {
        console.log('mintNfts called!')
        return new Promise((resolve) => {
            resolve([])
        })
    }

    sendAmount(addressesWithAmount, transferOptions): Promise<[]> {
        console.log('sendAmount called!')
        return new Promise((resolve) => {
            resolve([])
        })
    }
    sendMicroTransaction(addressesWithMicroAmount, transferOptions): Promise<[]> {
        console.log('sendMicroTransaction called!')
        return new Promise((resolve) => {
            resolve([])
        })
    }

    sendNativeTokens(addressNativeTokens, transferOptions): Promise<[]> {
        console.log('sendNativeTokens called!')
        return new Promise((resolve) => {
            resolve([])
        })
    }

    sendNft(addressesAndNftIds, transferOptions): Promise<[]> {
        console.log('sendNft called!')
        return new Promise((resolve) => {
            resolve([])
        })
    }

    sendTransfer(outputs, transferOptions): Promise<[]> {
        console.log('sendTransfer called!')
        return new Promise((resolve) => {
            resolve([])
        })
    }

    tryCollectOutputs(outputsToCollect): Promise<[]> {
        console.log('tryCollectOutputs called!')
        return new Promise((resolve) => {
            resolve([])
        })
    }

    setClientOptions(options): Promise<void> {
        console.log('setClientOptions called!')
        return new Promise((resolve) => {
            resolve()
        })
    }
}
