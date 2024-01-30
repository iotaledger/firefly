import { COIN_TYPE, NetworkId } from '@core/network'
import { getActiveWallets } from 'shared/lib/core/profile'
import { get } from 'svelte/store'
import { OnboardingType } from '../enums'
import { CannotRestoreWithMismatchedCoinTypeError } from '../errors'
import { onboardingProfile } from '../stores'

export function validateStrongholdCoinType(networkId: NetworkId): void {
    const wallets = getActiveWallets()

    if (wallets[0]?.walletOptions.bipPath?.coinType !== COIN_TYPE[networkId]) {
        const isClaiming = get(onboardingProfile)?.onboardingType === OnboardingType.Claim
        throw new CannotRestoreWithMismatchedCoinTypeError(isClaiming)
    }
}
