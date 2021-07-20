const TransportHid = require('@ledgerhq/hw-transport-node-hid').default;
const TransportSpeculos = require('@ledgerhq/hw-transport-node-speculos').default;
const Iota = require('hw-app-iota').default
const { ipcRenderer, remote } = require('electron')

const USE_SIMULATOR = false
const SIMULATOR_PORT = 9999;

const ipc = ipcRenderer;
const Wallet = remote.getCurrentWindow().webContents;

const Errors = {
    LEDGER_CANCELLED: 'Transaction cancelled on Ledger device.',
}

class Ledger {
    constructor() {
        this.connected = false;
        this.listeners = [];

        this.subscription = TransportHid.listen({
            next: (e) => {
                this.onMessage(e.type);
            }
        });

        this.selectSeed = this.selectSeed.bind(this);
        this.awaitConnection = this.awaitConnection.bind(this);
        this.awaitApplication = this.awaitApplication.bind(this);
        this.getAppMaxBundleSize = this.getAppMaxBundleSize.bind(this);
        this.addListener = this.addListener.bind(this);
        this.removeListener = this.removeListener.bind(this);
    }

    /**
     * Create Ledger Transport and select seed by index
     * @param {number} index - Target seed index
     * @param {number} page - Target seed page
     * @param {number} security - Target security level
     * @returns {object} Ledger IOTA transport
     */
    async selectSeed(index, page, security) {
        if (!this.connected) {
            Wallet.send('ledger', { awaitConnection: true });
            await this.awaitConnection();
            Wallet.send('ledger', { awaitConnection: false });
        }

        if (!this.connected) {
            throw new Error('Ledger connection error');
        }

        if (this.iota) {
            this.transport.close();
            this.iota = null;
        }

        await this.awaitApplication(index, page, security);

        return { iota: this.iota, callback: () => this.transport.close() };
    }

    /**
     * Wait for succesfull Ledger connection callback
     * @returns {promise}
     */
    async awaitConnection() {
        return new Promise((resolve, reject) => {
            const callbackSuccess = (connected) => {
                if (connected) {
                    resolve();
                    this.removeListener(callbackSuccess);
                    ipc.removeListener('ledger', callbackAbort);
                }
            };
            this.addListener(callbackSuccess);

            const callbackAbort = (e, message) => {
                if (message && message.abort) {
                    this.removeListener(callbackSuccess);
                    ipc.removeListener('ledger', callbackAbort);
                    reject(Errors.LEDGER_CANCELLED);
                }
            };
            ipc.on('ledger', callbackAbort);
        });
    }

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
                    this.transport = await TransportHid.create();

                    this.iota = new Iota(this.transport);

                    // TODO: Remove this before release.
                    // This is temporarily added for testing to ensure that testers do not 
                    // end up using the same address space as the one with their actual funds on. 
                    const testAccountIndex = index + 0x1e4d832a;

                    await this.iota.setActiveSeed(`44'/4218'/${testAccountIndex}'/${page}'`, security || 2);

                    Wallet.send('ledger', { awaitApplication: false });
                    clearTimeout(timeout);

                    resolve(true);
                } catch (error) {
                    if (this.transport) {
                        this.transport.close();
                    }
                    this.iota = null;

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

            const callbackAbort = (_e, message) => {
                if (message && message.abort) {
                    rejected = true;

                    ipc.removeListener('ledger', callbackAbort);

                    if (timeout) {
                        clearTimeout(timeout);
                    }
                    reject(Errors.LEDGER_CANCELLED);
                }
            };

            ipc.on('ledger', callbackAbort);
        });
    }

    /**
     * Retrieves the largest supported number of transactions
     * @returns {number}
     */
    async getAppMaxBundleSize() {
        return await this.iota.getAppMaxBundleSize();
    }

    /**
     * Proxy connection status to event listeners
     * @param {string} status -
     */
    onMessage(status) {
        this.connected = status === 'add';
        this.listeners.forEach((listener) => listener(this.connected));

        if (!this.connected && this.iota) {
            this.transport.close();
            this.iota = null;
        }
    }

    /**
     * Add an connection event listener
     * @param {function} callback - Event callback
     */
    addListener(callback) {
        this.listeners.push(callback);

        if (this.connected) {
            callback(this.connected);
        }
    }

    /**
     * Remove an connection event listener
     * @param {function} callback - Target event callback to remove
     */
    removeListener(callback) {
        this.listeners.forEach((listener, index) => {
            if (callback === listener) {
                this.listeners.splice(index, 1);
            }
        });
    }
}

class LedgerSpeculos extends Ledger {
    async selectSeed(index, page, security) {
        if (!this.connected) {
            Wallet.send('ledger', { awaitConnection: true });
            await this.awaitConnection();

            Wallet.send('ledger', { awaitConnection: false });
        }

        if (!this.connected) {
            throw new Error('Ledger connection error');
        }

        if (this.iota) {
            this.transport.close();
            this.iota = null;
        }

        await this.awaitApplication(index, page, security);

        return this.iota;
    }

    async awaitConnection() {
        return new Promise((resolve) => {
            this.connected = true;
            resolve()
        });
    }

    async awaitApplication(index, page, security) {
        return new Promise((resolve, reject) => {
            let timeout = null;
            let rejected = false;

            const callback = async () => {
                try {
                    this.transport = await TransportSpeculos.open({
                        apduPort: SIMULATOR_PORT
                    })

                    this.iota = new Iota(this.transport);

                    await this.iota.setActiveSeed(`44'/4218'/${index}'/${page}'`, security || 2);

                    Wallet.send('ledger', { awaitApplication: false });
                    clearTimeout(timeout);

                    resolve(true);
                } catch (error) {
                    if (this.transport) {
                        this.transport.close();
                    }
                    this.iota = null;

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

            const callbackAbort = (_e, message) => {
                if (message && message.abort) {
                    rejected = true;

                    ipc.removeListener('ledger', callbackAbort);

                    if (timeout) {
                        clearTimeout(timeout);
                    }
                    reject(Errors.LEDGER_CANCELLED);
                }
            };

            ipc.on('ledger', callbackAbort);
        });
    }
}

const _ledger = USE_SIMULATOR ? new LedgerSpeculos() : new Ledger();

export default _ledger;
