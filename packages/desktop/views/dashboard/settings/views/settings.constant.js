import { SettingsRoute } from '@core/router'
import { HELP_SETTINGS } from './help/help-settings.constant'
import { NETWORK_SETTINGS } from './network/network-settings.constant'
import { PROFILE_SETTINGS } from './profile/profile-settings.constant'
import { COLLECTIBLES_SETTINGS } from './collectibles/collectibles-settings.constant'
import { SECURITY_SETTINGS } from './security/security-settings.constant'
import { ADVANCED_SETTINGS } from './advanced/advanced-settings.constant'
import { GENERAL_SETTINGS } from './general/general-settings.constant'

export const SETTINGS = {
    [SettingsRoute.General]: GENERAL_SETTINGS,
    [SettingsRoute.Profile]: PROFILE_SETTINGS,
    [SettingsRoute.Network]: NETWORK_SETTINGS,
    [SettingsRoute.Collectibles]: COLLECTIBLES_SETTINGS,
    [SettingsRoute.Security]: SECURITY_SETTINGS,
    [SettingsRoute.Advanced]: ADVANCED_SETTINGS,
    [SettingsRoute.HelpAndInfo]: HELP_SETTINGS,
}
