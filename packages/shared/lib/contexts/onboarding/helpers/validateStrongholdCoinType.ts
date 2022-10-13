import { get, Writable } from 'svelte/store'

import { localize } from '@core/i18n'
import { COIN_TYPE, NetworkProtocol } from '@core/network'
import { createAccount, getAccounts, IProfileManager } from '@core/profile-manager'

import { ProfileSetupType } from '../enums'
import { CannotRestoreWithMismatchedCoinTypeError } from '../errors'
import { onboardingProfile } from '../stores'

export async function validateStrongholdCoinType(
    profileManager: Writable<IProfileManager>,
    networkProtocol: NetworkProtocol
): Promise<void> {
    const accounts = await getAccounts(profileManager)
    if (accounts?.length === 0) {
        const alias = `${localize('general.account')} 1`
        const account = await createAccount({ alias }, profileManager)
        accounts.push(account)
    }

    if (accounts[0]?.getMetadata()?.coinType !== COIN_TYPE[networkProtocol]) {
        const isClaiming = get(onboardingProfile)?.setupType === ProfileSetupType.Claimed
        throw new CannotRestoreWithMismatchedCoinTypeError(isClaiming)
    }
}
