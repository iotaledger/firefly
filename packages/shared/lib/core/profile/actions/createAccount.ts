import { IAccount } from '@core/account';
import { api } from '@core/api';
import { generateRandomId } from '@core/utils';
import { get } from 'svelte/store';
import { activeProfile as activeProfileStore } from '../stores';
import { getStorageDirectoryOfProfile } from '../utils';

// TODO(2.0): Fix and finish this method
/* - __storage__/
    - profile_id_1
        - secret manager
        - __wallet1__/
        - __wallet2__/
*/
export async function createAccount(): Promise<IAccount> {
    const id = generateRandomId();
    const storagePath = await getStorageDirectoryOfProfile(id);
    const snapshotPath = ''

    const activeProfile = get(activeProfileStore)

    const walletOptions = {
        clientOptions: activeProfile.clientOptions,
        secretManager: {
            stronghold: {
                snapshotPath,
            }
        },
    }
    const wallet = api.createAccount(id, {
        ...walletOptions,
        storagePath
    });

    return wallet
}
