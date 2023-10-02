const keytar = require('keytar')
import { app } from'electron'

/** Keychain object */
export default {
    /**
     * Service name — Key under which credentials will be stored.
     */
    SERVICE_NAME: app.isPackaged ? KEYCHAIN_SERVICE_NAME_PACKAGED : KEYCHAIN_SERVICE_NAME_NOT_PACKAGED,
    /**
     * Gets all credentials from keychain
     *
     * @method getAll
     *
     * @returns {Promise}
     */
    getAll() {
        return keytar.findCredentials(this.SERVICE_NAME)
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
        return keytar.getPassword(this.SERVICE_NAME, key)
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
        return keytar.deletePassword(this.SERVICE_NAME, key)
    },
}
