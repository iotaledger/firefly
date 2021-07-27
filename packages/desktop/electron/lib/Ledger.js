const TransportHid = require('@ledgerhq/hw-transport-node-hid').default;
const TransportSpeculos = require('@ledgerhq/hw-transport-node-speculos').default;
const Iota = require('hw-app-iota').default

const USE_SIMULATOR = true
const SIMULATOR_PORT = 9999;

async function createTransport() {
    if (USE_SIMULATOR) {
        return await TransportSpeculos.open({
            apduPort: SIMULATOR_PORT
        })
    }

    return await TransportHid.create();
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
            await this.awaitConnection();
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
        return new Promise((resolve) => {
            const callbackSuccess = (connected) => {
                if (connected) {
                    resolve();
                    this.removeListener(callbackSuccess);
                }
            };
            this.addListener(callbackSuccess);
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
                    this.transport = await createTransport();

                    this.iota = new Iota(this.transport);

                    // TODO: Remove this before release.
                    // This is temporarily added for testing to ensure that testers do not 
                    // end up using the same address space as the one with their actual funds on. 
                    const testAccountIndex = index + 0x1e4d832a;

                    await this.iota.setActiveSeed(`44'/4218'/${testAccountIndex}'/${page}'`, security || 2);

                    clearTimeout(timeout);

                    resolve(true);
                } catch (error) {
                    if (this.transport) {
                        this.transport.close();
                    }
                    this.iota = null;


                    if (rejected) {
                        return;
                    }

                    // Retry application await on error 0x6e00 - IOTA application not open
                    if (error.statusCode === 0x6e00) {
                        timeout = setTimeout(() => callback(), 4000);
                    } else {
                        reject(error);
                    }
                }
            };

            callback();
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
    async awaitConnection() {
        return new Promise((resolve) => {
            this.connected = true;
            resolve()
        });
    }
}

const _ledger = USE_SIMULATOR ? new LedgerSpeculos() : new Ledger();

export default _ledger;
