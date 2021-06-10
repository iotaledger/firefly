const Transport = require('@ledgerhq/hw-transport-node-hid').default;
const Iota = require('hw-app-iota').default;
const Wallet = require('electron').remote.getCurrentWindow().webContents;

const { ipcRenderer: ipc } = require('electron');

const connectionError = { message: 'Ledger connection error' };

function Ledger() {
    this.connected = false;
    this.listeners = [];

    this.subscription = Transport.listen({
        next: (e) => {
            this.onMessage(e.type);
        },
    });

    const self = this;

    return {
        /**
           * Create Ledger Transport and select seed by index
           * @param {number} index - Target seed index
           * @param {number} page - Target seed page
           * @param {number} security - Target security level
           * @returns {object} Ledger IOTA transport
           */
        async selectSeed(index, page, security) {
            if (!self.connected) {
                Wallet.send('ledger', { awaitConnection: true });
                await self.awaitConnection();
                Wallet.send('ledger', { awaitConnection: false });
            }

            if (!self.connected) {
                throw new Error('Ledger connection error');
            }

            if (self.iota) {
                self.transport.close();
                self.iota = null;
            }

            await self.awaitApplication(index, page, security);

            return self.iota;
        },

        /**
         * Wait for succesfull Ledger connection callback
         * @returns {promise}
         */
        async awaitConnection() {
            return new Promise((resolve, reject) => {
                const callbackSuccess = (connected) => {
                    if (connected) {
                        resolve();
                        self.removeListener(callbackSuccess);
                        ipc.removeListener('ledger', callbackAbort);
                    }
                };
                self.addListener(callbackSuccess);

                const callbackAbort = (e, message) => {
                    if (message && message.abort) {
                        self.removeListener(callbackSuccess);
                        ipc.removeListener('ledger', callbackAbort);
                        reject(connectionError);
                    }
                };
                ipc.on('ledger', callbackAbort);
            });
        },

        /**
         * Wait for IOTA application and selected seed by index
         * @param {number} index - Target seed index
         * @param {number} page - Target seed page
         * @param {number} security - Target security level
         * @returns {promise} Resolves with IOTA Transport object
         */
        async awaitApplication(index, page, security) {
            return new Promise((resolve, reject) => {
                let timeout = null;
                let rejected = false;

                const callback = async () => {
                    try {
                        self.transport = await Transport.create();
                        self.iota = new Iota(self.transport);

                        await self.iota.setActiveSeed(`44'/4218'/${index}'/${page}'`, security || 2);

                        Wallet.send('ledger', { awaitApplication: false });
                        clearTimeout(timeout);

                        resolve(true);
                    } catch (error) {
                        if (self.transport) {
                            self.transport.close();
                        }
                        self.iota = null;

                        Wallet.send('ledger', { awaitApplication: true });

                        if (rejected) {
                            return;
                        }

                        // Retry application await on error 0x6e00 - IOTA application not open
                        if (error.statusCode === 0x6e00) {
                            timeout = setTimeout(() => callback(), 4000);
                        } else {
                            Wallet.send('ledger', { awaitApplication: false });
                            reject(error);
                        }
                    }
                };

                callback();

                const callbackAbort = (e, message) => {
                    if (message && message.abort) {
                        rejected = true;

                        ipc.removeListener('ledger', callbackAbort);

                        if (timeout) {
                            clearTimeout(timeout);
                        }
                        reject(connectionError);
                    }
                };

                ipc.on('ledger', callbackAbort);
            });
        },

        /**
         * Proxy connection status to event listeners
         * @param {string} status -
         */
        onMessage(status) {
            self.connected = status === 'add';
            self.listeners.forEach((listener) => listener(self.connected));

            if (!self.connected && self.iota) {
                self.transport.close();
                self.iota = null;
            }
        },

        /**
         * Add an connection event listener
         * @param {function} callback - Event callback
         */
        addListener(callback) {
            self.listeners.push(callback);
            if (self.connected) {
                callback(self.connected);
            }
        },

        /**
         * Remove an connection event listener
         * @param {function} callback - Target event callback to remove
         */
        removeListener(callback) {
            self.listeners.forEach((listener, index) => {
                if (callback === listener) {
                    self.listeners.splice(index, 1);
                }
            });
        },
    }
}

const ledger = new Ledger();

module.exports = ledger;
