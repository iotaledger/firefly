import { BalanceFinder, HiddenWallets, DeveloperToggle } from '.'
import { AdvancedSettingsRoute } from '@core/router'

export const ADVANCED_SETTINGS = [
    { component: BalanceFinder, childRoute: AdvancedSettingsRoute.BalanceFinder, requiresLogin: true },
    { component: HiddenWallets, childRoute: AdvancedSettingsRoute.HiddenAccounts, requiresLogin: true },
    { component: DeveloperToggle, childRoute: AdvancedSettingsRoute.DeveloperToggle, requiresLogin: true },
]
