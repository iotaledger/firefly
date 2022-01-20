import extension from '../shared/browser'

const runtime = extension.runtime

const WalletPlugin = {

    sendMessage: async function(m) {
        runtime.sendMessage(m.message)
    },

    addListener(event, callback) {
        // walletMessageReceived
        runtime.onMessage.addListener(callback);
    },

    initialize: function(d) {
        // d.storagePath
    }

}

export const Plugins = {WalletPlugin}
