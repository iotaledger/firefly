import { ClientOptions, SecretManager } from '@iota/wallet'
import { api } from '../api'
import { profileManager } from '../stores'

export function initialiseProfileManager(
    storagePath: string,
    clientOptions?: ClientOptions,
    secretManager?: SecretManager
): void {
    const newProfileManager = api.createAccountManager({
        storagePath,
        clientOptions,
        secretManager,
    })
    profileManager.set(newProfileManager)
}
