import 'capacitor-secure-storage-plugin';
import { Plugins } from "@capacitor/core"

const { SecureStoragePlugin } = Plugins

function handle_keychain() {
    
    function set(key: string, pincode: string): Promise<boolean> {
        return SecureStoragePlugin.set({ 
            key, 
            value: pincode 
        }).catch(error => {
            console.trace({ error })
        })
    }
    
    function get(key: string): Promise<string> {
        return SecureStoragePlugin.get({ key })
            .catch(error => {
                console.trace({ error })
        })
    }

    function remove(key: string): Promise<boolean> {
        return SecureStoragePlugin.remove({ key })
            .catch(error => {
                console.trace({ error })
        })
    }

    return {
        /**
         * Sets pincode in keychain
         * @method set
         */
        set,
        /**
         * Gets pincode from keychain
         * @method get
         */
        get,
        /**
         * Removes pincode entry from the keychain
         * @method remove
         */
        remove
    }
}

/** Mobile Pincode Manager  */
export const PincodeManager = handle_keychain()
