import { get } from 'svelte/store'

import { AppContext } from '@core/app/enums'
import { IRouter } from '@core/router/interfaces'

import {
    accountSwitcherRouter,
    activityRouter,
    appSetupRouter,
    networkSetupRouter,
    profileBackupRouter,
    profileRecoveryRouter,
    profileSetupRouter,
    sendRouter,
    storageProtectionSetupRouter,
    strongholdSetupRouter,
    tokenRouter,
} from '../subrouters'

export function getSubroutersForAppContext(context: AppContext): IRouter[] {
    switch (context) {
        case AppContext.Dashboard:
            return [get(accountSwitcherRouter), get(sendRouter), get(activityRouter), get(tokenRouter)]
        case AppContext.Login:
            return []
        case AppContext.Onboarding:
            return [
                get(appSetupRouter),
                get(networkSetupRouter),
                get(strongholdSetupRouter),
                get(profileBackupRouter),
                get(profileRecoveryRouter),
                get(profileSetupRouter),
                get(storageProtectionSetupRouter),
            ]
        case AppContext.Settings:
            return []
        default:
            return []
    }
}
