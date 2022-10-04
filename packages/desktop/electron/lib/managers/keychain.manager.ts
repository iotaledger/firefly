import keytar from 'keytar'
import { app } from 'electron'

export const KeychainManager = {
    // SERVICE_NAME: Key under which credentials will be stored.
    // @ts-expect-error : APP_NAME is replaced by webpack script
    SERVICE_NAME: app.isPackaged ? APP_NAME : 'Firefly — Dev',
    // Gets all credentials from keychain
    getAll(): Promise<{ account: string; password: string }[]> {
        return keytar.findCredentials(this.SERVICE_NAME)
    },
    // Gets credential from keychain for provided key
    get(key: string): Promise<string | null> {
        return keytar.getPassword(this.SERVICE_NAME, key)
    },
    // Sets credential in keychain for provided key
    set(key: string, content: string): Promise<void> {
        return keytar.setPassword(this.SERVICE_NAME, key, content)
    },
    // Removes credential from keychain for provided key
    remove(key: string): Promise<boolean> {
        return keytar.deletePassword(this.SERVICE_NAME, key)
    },
}
