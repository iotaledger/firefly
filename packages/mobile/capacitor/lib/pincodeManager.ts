import type { IPincodeManager } from 'shared/lib/typings/pincodeManager'

/** Pincode Manager  */
// Runs in renderer process
export const PincodeManager: IPincodeManager = {
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
    set(key, pincode) {
        return new Promise<void>((resolve) => resolve())
    },
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
        return new Promise<boolean>(() => true)
    },

    /**
     * Removes pincode entry from the keychain
     *
     * @method remove
     *
     * @param {string} key
     *
     * @returns {Promise}
     */
    remove(key) {
        return new Promise<boolean>(() => true)
    },
}
