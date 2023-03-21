import {
    AdvancedSettingsRoute,
    GeneralSettingsRoute,
    HelpAndInfoRoute,
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
    [SecuritySettingsRoute.ExportStronghold]: Icon.Export,
    [SecuritySettingsRoute.AppLock]: Icon.Lock3,
    [SecuritySettingsRoute.MaxMediaSize]: Icon.File,
    [SecuritySettingsRoute.ChangePassword]: Icon.Lock2,
    [SecuritySettingsRoute.ChangePincode]: Icon.Lock,
    [ProfileSettingsRoute.DeleteProfile]: Icon.Delete,
    [AdvancedSettingsRoute.NetworkConfiguration]: Icon.Wifi,
    [AdvancedSettingsRoute.WalletFinder]: Icon.Reset,
    [AdvancedSettingsRoute.HiddenAccounts]: Icon.View,
    [HelpAndInfoRoute.Diagnostics]: Icon.Tools,
    [HelpAndInfoRoute.ErrorLog]: Icon.Warning,
    [HelpAndInfoRoute.Documentation]: Icon.Doc,
    [HelpAndInfoRoute.Faq]: Icon.Speech,
    [HelpAndInfoRoute.Discord]: Icon.Discord,
    [HelpAndInfoRoute.ReportAnIssue]: Icon.Help,
}
