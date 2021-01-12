const keytar = require('keytar')
const { remote } = require('electron')

/** Keychain object */
const Keychain = {
    /**
     * Service name — Key under which credentials will be stored.
     */
    SERVICE_NAME: remote.app.isPackaged ? 'Firefly' : 'Firefly — Dev',
    /**
     * Gets all credentials from keychain
     * 
     * @method getAll
     * 
     * @returns {Promise}
     */
    getAll() {
        return keytar.findCredentials(this.SERVICE_NAME);
    },
    /**
     * Gets credential from keychain for provided key
     * 
     * @method get
     * 
     * @param {string} key
     * 
     * @returns {Promise}
     */
    get(key) {
        return keytar.getPassword(this.SERVICE_NAME, key);
    },
    /**
     * Sets credential in keychain for provided key
     * 
     * @param {string} key
     * @param {string} content
     * 
     * @method set
     * 
     * @returns {Promise}
     */
    set(key, content) {
        return keytar.setPassword(this.SERVICE_NAME, key, content)
    },
    /**
     * Removes credential from keychain for provided key
     * 
     * @method remove
     * 
     * @param {string} key
     * 
     * @returns {Promise}
     */
    remove(key) {
        return keytar.deletePassword(this.SERVICE_NAME, key);
    }
}

/** Pincode Manager  */
const PincodeManager = {
     /**
     * Key name — Key against which pincode will be stored in keychain
     */
    KEY_NAME: 'pincode',
    /**
     * Sets pincode in keychain
     * 
     * @method set
     * 
     * @param {string} pincode 
     * 
     * @returns {Promise}
     */
    set(pincode) {
        if ('string' !== typeof pincode) {
            return Promise.reject(new Error('Invalid pincode provided.'));
        }

        return Keychain.get(this.KEY_NAME).then((storedPincode) => {
            // Do not allow overriding pincode if there's already one stored in keychain. 
            if (storedPincode) {
                throw new Error('Pincode already stored.')
            }

            return Keychain.set(this.KEY_NAME, pincode);
        })
        
    },
    /**
     * Verifies user entered pincode against the one stored in keychain
     * 
     * @method verify
     * 
     * @param {string} pincode 
     * 
     * @returns {Promise}
     */
    verify(pincode) {
        if ('string' !== typeof pincode) {
            return Promise.reject(new Error('Invalid pincode provided.'));
        }

        return Keychain.get(this.KEY_NAME).then(
            (storedPincode) => storedPincode === pincode
        );
    }
}


exports.default = Keychain;
module.exports = {
    PincodeManager
}
