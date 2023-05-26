const { ipcRenderer } = require('electron')

const LedgerApi = {
    generateEvmAddress(bip32Path, verify) {
        return ipcRenderer.send('generate-evm-address', bip32Path, verify ?? false)
    },
    signEvmTransaction(data, chainId, bip32Path) {
        return ipcRenderer.send('sign-evm-transaction', data, chainId, bip32Path)
    },
}

module.exports = LedgerApi
