import { localize } from '@core/i18n'
import { COIN_TYPE, NetworkId } from '@core/network'
import { createWallet, getAccounts, IProfileManager } from '@core/profile-manager'
import { get, Writable } from 'svelte/store'
import { OnboardingType } from '../enums'
import { CannotRestoreWithMismatchedCoinTypeError } from '../errors'
import { onboardingProfile } from '../stores'

export async function validateStrongholdCoinType(
    profileManager: Writable<IProfileManager>,
    networkId: NetworkId
): Promise<void> {
    const accounts = await getAccounts(profileManager)
    if (accounts?.length === 0) {
        const alias = `${localize('general.account')} 1`
        const account = await createWallet({ alias }, profileManager)
        accounts.push(account)
    }

    if (accounts[0]?.getMetadata()?.coinType !== COIN_TYPE[networkId]) {
        const isClaiming = get(onboardingProfile)?.onboardingType === OnboardingType.Claim
        throw new CannotRestoreWithMismatchedCoinTypeError(isClaiming)
    }
}
