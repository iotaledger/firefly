import { validatePin } from 'shared/lib/utils'
const { ipcRenderer } = require('electron')

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
        if (validatePin(pincode)) {
            return Promise.reject(new Error('Invalid pincode provided.'));
        }
        
        return ipcRenderer.invoke('keychain-get', this.KEY_NAME).then((storedPincode) => {
            // Do not allow overriding pincode if there's already one stored in keychain. 
            if (storedPincode) {
                return Promise.reject('Pincode already stored.')
            }

            return ipcRenderer.invoke('keychain-set', this.KEY_NAME, pincode);
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
        return ipcRenderer.invoke('keychain-get', this.KEY_NAME).then(
            (storedPincode) => storedPincode === pincode
        );
    }
}

module.exports = PincodeManager;
