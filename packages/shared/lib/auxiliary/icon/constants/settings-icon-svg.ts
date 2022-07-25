import { AdvancedSettingsRoute, GeneralSettingsRoute, HelpAndInfoRoute, SecuritySettingsRoute } from '@core/router'

import { Icon } from '../enums'

export const SETTINGS_ICON_SVG = {
    [GeneralSettingsRoute.Theme]: Icon.Theme,
    [GeneralSettingsRoute.Language]: Icon.Language,
    [GeneralSettingsRoute.Currency]: Icon.Currency,
    [GeneralSettingsRoute.Notifications]: Icon.Bell,
    [GeneralSettingsRoute.NetworkStatus]: Icon.View,
    [GeneralSettingsRoute.ChangeProfileName]: Icon.Profile,
    [SecuritySettingsRoute.ExportStronghold]: Icon.Export,
    [SecuritySettingsRoute.AppLock]: Icon.Lock3,
    [SecuritySettingsRoute.ChangePassword]: Icon.Lock2,
    [SecuritySettingsRoute.ChangePincode]: Icon.Lock,
    [SecuritySettingsRoute.DeleteProfile]: Icon.Delete,
    [AdvancedSettingsRoute.NetworkConfiguration]: Icon.Wifi,
    [AdvancedSettingsRoute.DeepLinks]: Icon.Link,
    [AdvancedSettingsRoute.WalletFinder]: Icon.Reset,
    [AdvancedSettingsRoute.HiddenAccounts]: Icon.View,
    [AdvancedSettingsRoute.ErrorLog]: Icon.Warning,
    [AdvancedSettingsRoute.CrashReporting]: Icon.Doc,
    [AdvancedSettingsRoute.Diagnostics]: Icon.Tools,
    [AdvancedSettingsRoute.MigrateLedgerIndex]: Icon.Ledger,
    [HelpAndInfoRoute.Documentation]: Icon.Doc,
    [HelpAndInfoRoute.Faq]: Icon.Speech,
    [HelpAndInfoRoute.Discord]: Icon.Discord,
    [HelpAndInfoRoute.ReportAnIssue]: Icon.Help,
}
