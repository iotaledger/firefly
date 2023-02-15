import { get } from 'svelte/store'

import { AppContext } from '@core/app/enums'
import { IRouter } from '@core/router/interfaces'

import {
    accountActionsRouter,
    accountSwitcherRouter,
    appSetupRouter,
    networkSetupRouter,
    networkConfigurationSettingsRouter,
    profileBackupRouter,
    profileRecoveryRouter,
    profileRouter,
    profileSetupRouter,
    sendRouter,
    settingsRouter,
    storageProtectionSetupRouter,
    strongholdSetupRouter,
    tokenRouter,
    filterRouter,
} from '../routers'

export function getSubroutersForAppContext(context: AppContext): IRouter[] {
    switch (context) {
        case AppContext.Dashboard:
            return [
                get(accountSwitcherRouter),
                get(accountActionsRouter),
                get(sendRouter),
                get(tokenRouter),
                get(filterRouter),
                get(profileRouter),
                get(settingsRouter),
                get(networkConfigurationSettingsRouter),
            ]
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
