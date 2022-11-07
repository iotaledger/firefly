import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin'

import { IPincodeManager } from '@core/app'

/** Mobile Pincode Manager */
export const PincodeManager: IPincodeManager = {
    /**
     * Sets pincode in keychain
     * @method set
     */
    set: async (key: string, pin: string): Promise<void> => {
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
    },
    /**
     * Verify pincode from keychain
     * @method verify
     */
    verify: async (key: string, pin: string): Promise<boolean> => {
        try {
            const { value } = await SecureStoragePlugin.get({ key })
            return value === pin
        } catch (error) {
            console.error(error)
        }
    },
    /**
     * Removes pincode entry from the keychain
     * @method remove
     */
    remove: async (key: string): Promise<boolean> => {
        try {
            const { value } = await SecureStoragePlugin.remove({ key })
            return value
        } catch (error) {
            console.error(error)
        }
    },
}
