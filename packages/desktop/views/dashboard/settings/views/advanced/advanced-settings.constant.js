import { BalanceFinder, WalletFinder, HiddenAccounts, DeveloperToggle } from '.'
import { AdvancedSettingsRoute } from '@core/router'

export const ADVANCED_SETTINGS = [
    { component: WalletFinder, childRoute: AdvancedSettingsRoute.WalletFinder, requiresLogin: true },
    { component: BalanceFinder, childRoute: AdvancedSettingsRoute.BalanceFinder, requiresLogin: true },
    { component: HiddenAccounts, childRoute: AdvancedSettingsRoute.HiddenAccounts, requiresLogin: true },
    { component: DeveloperToggle, childRoute: AdvancedSettingsRoute.DeveloperToggle, requiresLogin: true },
]
