import { COIN_TYPE, NetworkId } from '@core/network'
import { getWallets } from 'shared/lib/core/profile'
import { get } from 'svelte/store'
import { OnboardingType } from '../enums'
import { CannotRestoreWithMismatchedCoinTypeError } from '../errors'
import { onboardingProfile } from '../stores'

// Todo(2.0) Fix this
export async function validateStrongholdCoinType(networkId: NetworkId): Promise<void> {
    const wallets = await getWallets() // TODO (2.0) Should we be passing like a profile ID or something here?

    // TODO(2.0) Fix this
    if (wallets[0]?.coinType !== COIN_TYPE[networkId]) {
        const isClaiming = get(onboardingProfile)?.onboardingType === OnboardingType.Claim
        throw new CannotRestoreWithMismatchedCoinTypeError(isClaiming)
    }
}
