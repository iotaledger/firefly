const { ipcRenderer } = require('electron')

const LedgerApi = {
    generateEvmAddress(bip32Path, verify) {
        return ipcRenderer.send('generate-evm-address', bip32Path, verify ?? false)
    },
    signEvmTransaction(data, bip32Path) {
        return ipcRenderer.send('sign-evm-transaction', data, bip32Path)
    },
}

module.exports = LedgerApi
