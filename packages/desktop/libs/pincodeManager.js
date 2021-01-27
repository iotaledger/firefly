const { ipcRenderer } = require('electron')

/** Pincode Manager  */
// Runs in renderer process
const PincodeManager = {
    /**
     * Sets pincode in keychain
     * 
     * @method set
     * 
     * @param {string} key
     * @param {string} pincode 
     * 
     * @returns {Promise}
     */
    set(key, pincode) { return ipcRenderer.invoke('keychain-set', key, pincode) },
    /**
     * Verifies user entered pincode against the one stored in keychain
     * 
     * @method verify
     * 
     * @param {string} key
     * @param {string} pincode 
     * 
     * @returns {Promise}
     */
    verify(key, pincode) {
        return ipcRenderer.invoke('keychain-get', key).then(
            (storedPincode) => {
                return storedPincode === pincode;
            }
        );
    }
}

module.exports = PincodeManager;
