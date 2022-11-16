import { AppContext } from '@core/app/enums'
import { IRouter } from '@core/router/interfaces'
import {
    appSetupRouter,
    ledgerSetupRouter,
    networkSetupRouter,
    profileBackupRouter,
    profileRecoveryRouter,
    profileSetupRouter,
    shimmerClaimingRouter,
    storageProtectionSetupRouter,
    strongholdSetupRouter,
} from '@core/router/subrouters'
import { get } from 'svelte/store'

export function getSubroutersForAppContext(context: AppContext): IRouter[] {
    switch (context) {
        case AppContext.Dashboard:
            return []
        case AppContext.Login:
            return []
        case AppContext.Onboarding:
            return [
                get(appSetupRouter),
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
