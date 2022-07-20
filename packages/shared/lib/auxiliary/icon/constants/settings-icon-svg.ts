import { AdvancedSettings, GeneralSettings, HelpAndInfo, SecuritySettings } from '@lib/core/router'
import { Icon } from '../enums'

export const SETTINGS_ICONS = {
    [GeneralSettings.Theme]: Icon.Theme,
    [GeneralSettings.Language]: Icon.Language,
    [GeneralSettings.Currency]: Icon.Currency,
    [GeneralSettings.Notifications]: Icon.Bell,
    [GeneralSettings.NetworkStatus]: Icon.View,
    [GeneralSettings.ChangeProfileName]: Icon.Profile,
    [SecuritySettings.ExportStronghold]: Icon.Export,
    [SecuritySettings.AppLock]: Icon.Lock3,
    [SecuritySettings.ChangePassword]: Icon.Lock2,
    [SecuritySettings.ChangePincode]: Icon.Lock,
    [SecuritySettings.DeleteProfile]: Icon.Delete,
    [AdvancedSettings.NetworkConfiguration]: Icon.Wifi,
    [AdvancedSettings.DeepLinks]: Icon.Link,
    [AdvancedSettings.WalletFinder]: Icon.Reset,
    [AdvancedSettings.HiddenAccounts]: Icon.View,
    [AdvancedSettings.ErrorLog]: Icon.Warning,
    [AdvancedSettings.CrashReporting]: Icon.Doc,
    [AdvancedSettings.Diagnostics]: Icon.Tools,
    [AdvancedSettings.MigrateLedgerIndex]: Icon.Ledger,
    [HelpAndInfo.Documentation]: Icon.Doc,
    [HelpAndInfo.Faq]: Icon.Speech,
    [HelpAndInfo.Discord]: Icon.Discord,
    [HelpAndInfo.ReportAnIssue]: Icon.Help,
}
