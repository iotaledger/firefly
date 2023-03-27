import { WalletFinder, HiddenAccounts } from '.'
import { AdvancedSettingsRoute } from '@core/router'

export const ADVANCED_SETTINGS = [
    { component: WalletFinder, childRoute: AdvancedSettingsRoute.WalletFinder, requiresLogin: true },
    { component: HiddenAccounts, childRoute: AdvancedSettingsRoute.HiddenAccounts, requiresLogin: true },
]
