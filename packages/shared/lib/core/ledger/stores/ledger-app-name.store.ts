import { Readable, derived } from 'svelte/store'
import { profileNetwork } from '@core/profile/stores/profile-network.store'
import { onboardingProfileNetwork } from '@contexts/onboarding'
import { LedgerAppName } from '@core/ledger'
import { NetworkId } from '@core/network'

export const ledgerAppName: Readable<LedgerAppName> = derived(
    [profileNetwork, onboardingProfileNetwork],
    ([$profileNetwork, $onboardingProfileNetwork]) => {
        const networkId = $profileNetwork?.id || $onboardingProfileNetwork?.id || NetworkId.Iota
        return networkId === NetworkId.Iota || networkId === NetworkId.IotaAlphanet
            ? LedgerAppName.Iota
            : LedgerAppName.Shimmer
    }
)
