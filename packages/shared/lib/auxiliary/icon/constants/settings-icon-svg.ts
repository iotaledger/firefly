import {
    AdvancedSettingsRoute,
    CollectiblesSettingsRoute,
    GeneralSettingsRoute,
    HelpAndInfoRoute,
    NetworkSettingsRoute,
    ProfileSettingsRoute,
    SecuritySettingsRoute,
} from '@core/router'

import { Icon } from '../enums'

export const SETTINGS_ICON_SVG = {
    [GeneralSettingsRoute.Theme]: Icon.Theme,
    [GeneralSettingsRoute.Language]: Icon.Language,
    [GeneralSettingsRoute.Notifications]: Icon.Bell,
    [GeneralSettingsRoute.DeepLinks]: Icon.Link,
    [GeneralSettingsRoute.CrashReporting]: Icon.Doc,
    [ProfileSettingsRoute.ChangeProfileName]: Icon.Profile,
    [ProfileSettingsRoute.Currency]: Icon.Currency,
    [ProfileSettingsRoute.DeleteProfile]: Icon.Delete,
    [CollectiblesSettingsRoute.MaxMediaSize]: Icon.File,
    [NetworkSettingsRoute.NetworkConfiguration]: Icon.Wifi,
    [SecuritySettingsRoute.ExportStronghold]: Icon.Export,
    [SecuritySettingsRoute.AppLock]: Icon.Lock3,
    [SecuritySettingsRoute.ChangePassword]: Icon.Lock2,
    [SecuritySettingsRoute.ChangePincode]: Icon.Lock,
    [AdvancedSettingsRoute.WalletFinder]: Icon.Reset,
    [AdvancedSettingsRoute.HiddenAccounts]: Icon.View,
    [HelpAndInfoRoute.Diagnostics]: Icon.Tools,
    [HelpAndInfoRoute.ErrorLog]: Icon.Warning,
    [HelpAndInfoRoute.Documentation]: Icon.Doc,
    [HelpAndInfoRoute.Faq]: Icon.Speech,
    [HelpAndInfoRoute.Discord]: Icon.Discord,
    [HelpAndInfoRoute.ReportAnIssue]: Icon.Help,
}
