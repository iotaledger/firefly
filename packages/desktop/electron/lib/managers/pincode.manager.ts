import { ipcRenderer } from 'electron'
import { KeychainEvent } from '../enums'

export const PincodeManager = {
    // Sets pincode in keychain
    set(key: string, pincode: string): Promise<unknown> {
        return ipcRenderer.invoke(KeychainEvent.Set, key, pincode)
    },
    // Verifies user entered pincode against the one stored in keychain
    verify(key: string, pincode: string): Promise<unknown> {
        return ipcRenderer.invoke(KeychainEvent.Get, key).then((storedPincode) => storedPincode === pincode)
    },
    // Removes pincode entry from the keychain
    remove(key: string): Promise<unknown> {
        return ipcRenderer.invoke(KeychainEvent.Remove, key)
    },
}
