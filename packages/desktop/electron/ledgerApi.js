const { ipcRenderer } = require('electron')

const LedgerApi = {
    generateEvmAddress(coinType, accountIndex, verify) {
        return ipcRenderer.invoke('generate-evm-address', coinType, accountIndex, verify ?? false)
    },
}

module.exports = LedgerApi
