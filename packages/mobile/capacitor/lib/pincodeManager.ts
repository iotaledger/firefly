import type { IPincodeManager } from 'shared/lib/typings/pincodeManager'
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

/** Mobile Pincode Manager  */
export const PincodeManager = handleKeychain()

function handleKeychain(): IPincodeManager {
    async function set(key: string, pin: string): Promise<void> {
        try {
            const { value } = await SecureStoragePlugin.set({ key, value: pin })
            if (value) {
                return
            } else {
                throw new Error('pincode can not be stored')
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function verify(key: string, pin: string): Promise<boolean> {
        try {
            const { value } = await SecureStoragePlugin.get({ key })
            return value === pin
        } catch (error) {
            console.error(error)
        }
    }

    async function remove(key: string): Promise<boolean> {
        try {
            const { value } = await SecureStoragePlugin.remove({ key })
            return value
        } catch (error) {
            console.error(error)
        }
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
        verify,
        /**
         * Removes pincode entry from the keychain
         * @method remove
         */
        remove
    }
}
