import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { COIN_TYPE, NetworkProtocol } from '@core/network'
import { profileManager, restoreBackup } from '@core/profile-manager'

import { onboardingProfile, updateOnboardingProfile } from '../stores'
import { CannotRestoreWithMismatchedCoinTypeError } from '../errors'

export async function restoreBackupFromStrongholdFile(
    strongholdPassword: string,
    networkProtocol: NetworkProtocol
): Promise<void> {
    const { importFilePath } = get(onboardingProfile)
    await restoreBackup(importFilePath, strongholdPassword)

    const accounts = await get(profileManager).getAccounts()
    if (accounts.length === 0) {
        const alias = `${localize('general.account')} 1`
        const account = await get(profileManager)?.createAccount({ alias })
        accounts.push(account)
    }
    if (accounts[0]?.meta?.coinType !== COIN_TYPE[networkProtocol]) {
        throw new CannotRestoreWithMismatchedCoinTypeError()
    }

    updateOnboardingProfile({ lastStrongholdBackupTime: new Date() })
}
