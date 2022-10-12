import { get } from 'svelte/store'

import { localize } from '@core/i18n'
import { COIN_TYPE, NetworkProtocol } from '@core/network'
import { IProfileManager } from '@core/profile-manager'

import { ProfileSetupType } from '../enums'
import { CannotRestoreWithMismatchedCoinTypeError } from '../errors'
import { onboardingProfile } from '../stores'

export async function validateStrongholdCoinType(
    profileManager: IProfileManager,
    networkProtocol: NetworkProtocol
): Promise<void> {
    const accounts = await profileManager?.getAccounts()
    if (accounts?.length === 0) {
        const alias = `${localize('general.account')} 1`
        const account = await profileManager?.createAccount({ alias })
        accounts.push(account)
    }

    if (accounts[0]?.meta?.coinType !== COIN_TYPE[networkProtocol]) {
        const isClaiming = get(onboardingProfile)?.setupType === ProfileSetupType.Claimed
        throw new CannotRestoreWithMismatchedCoinTypeError(isClaiming)
    }
}
