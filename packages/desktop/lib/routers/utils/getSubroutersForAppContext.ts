import { AppContext } from '@core/app/enums'
import { IRouter } from '@core/router/interfaces'
import {
    ledgerSetupRouter,
    networkSetupRouter,
    profileBackupRouter,
    profileRecoveryRouter,
    profileSetupRouter,
    shimmerClaimingRouter,
    storageProtectionSetupRouter,
    strongholdSetupRouter,
    updateStrongholdRouter,
} from '@core/router/subrouters'
import { get } from 'svelte/store'

export function getSubroutersForAppContext(context: AppContext): IRouter[] {
    switch (context) {
        case AppContext.Dashboard:
            return []
        case AppContext.Login:
            return [get(updateStrongholdRouter)]
        case AppContext.Onboarding:
            return [
                get(ledgerSetupRouter),
                get(networkSetupRouter),
                get(strongholdSetupRouter),
                get(profileBackupRouter),
                get(profileRecoveryRouter),
                get(profileSetupRouter),
                get(storageProtectionSetupRouter),
                get(shimmerClaimingRouter),
            ]
        case AppContext.Settings:
            return []
        default:
            return []
    }
}
