import { Readable, derived } from 'svelte/store'
import { profileNetwork } from '@core/profile'
import { onboardingProfileNetwork } from '@contexts/onboarding'
import { LedgerAppName } from '@core/ledger'
import { NetworkId } from '@core/network'

export const ledgerAppName: Readable<LedgerAppName> = derived(
    [profileNetwork, onboardingProfileNetwork],
    ([$profileNetwork, $onboardingProfileNetwork]) => {
        const networkId = $profileNetwork?.id || $onboardingProfileNetwork?.id || NetworkId.Iota
        return networkId === NetworkId.Iota ||
            networkId === NetworkId.IotaAlphanet ||
            networkId === NetworkId.IotaTestnet
            ? LedgerAppName.Iota
            : LedgerAppName.Shimmer
    }
)
