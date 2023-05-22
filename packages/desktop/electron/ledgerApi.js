const { ipcRenderer } = require('electron')

const LedgerApi = {
    generateEvmAddress(coinType, accountIndex, verify) {
        return ipcRenderer.send('generate-evm-address', coinType, accountIndex, verify ?? false)
    },
    signEvmTransaction(data) {
        return ipcRenderer.send('sign-evm-transaction', data)
    },
}

module.exports = LedgerApi
