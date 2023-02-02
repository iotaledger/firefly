import { DISCORD_URL, DOCUMENTATION_URL, FAQ_URL, ISSUE_REPORT_URL } from '@contexts/settings'
import { SETTINGS_ICON_SVG } from '@lib/auxiliary/icon'
import features from '../../../../features/features'
import {
    AppLockView,
    ChangePasswordView,
    ChangeProfileNameView,
    CurrencyView,
    DeleteProfileView,
    DiagnosticsView,
    ErrorLogView,
    ExportStrongholdView,
    HiddenAccountsView,
    LanguageView,
    NetworkConfigurationRouter,
    ThemeView,
    WalletFinderView,
} from '../../../../views/dashboard/drawers/profile/views/settings'
import { SettingsRoute } from '../../../routers'
import { SettingsCategory } from '../enums'

const { general, security, advanced, helpAndInfo } = features.settings

export const SETTINGS_ROUTE_META = {
    // General
    [SettingsRoute.Theme]: {
        name: `views.settings.${SettingsRoute.Theme}.title`,
        category: SettingsCategory.General,
        enabled: general?.[SettingsRoute.Theme]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.Theme],
        view: ThemeView,
    },
    [SettingsRoute.Language]: {
        name: `views.settings.${SettingsRoute.Language}.title`,
        category: SettingsCategory.General,
        enabled: general?.[SettingsRoute.Language]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.Language],
        view: LanguageView,
    },
    [SettingsRoute.Currency]: {
        name: `views.settings.${SettingsRoute.Currency}.title`,
        category: SettingsCategory.General,
        enabled: general?.[SettingsRoute.Currency]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.Currency],
        view: CurrencyView,
    },
    [SettingsRoute.ChangeProfileName]: {
        name: `views.settings.${SettingsRoute.ChangeProfileName}.title`,
        category: SettingsCategory.General,
        enabled: general?.[SettingsRoute.ChangeProfileName]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.ChangeProfileName],
        view: ChangeProfileNameView,
    },
    // Security
    [SettingsRoute.ExportStronghold]: {
        name: `views.settings.${SettingsRoute.ExportStronghold}.title`,
        category: SettingsCategory.Security,
        enabled: security?.[SettingsRoute.ExportStronghold]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.ExportStronghold],
        view: ExportStrongholdView,
    },
    [SettingsRoute.AppLock]: {
        name: `views.settings.${SettingsRoute.AppLock}.title`,
        category: SettingsCategory.Security,
        enabled: security?.[SettingsRoute.AppLock]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.AppLock],
        view: AppLockView,
    },
    [SettingsRoute.ChangePassword]: {
        name: `views.settings.${SettingsRoute.ChangePassword}.title`,
        category: SettingsCategory.Security,
        enabled: security?.[SettingsRoute.ChangePassword]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.ChangePassword],
        view: ChangePasswordView,
    },
    [SettingsRoute.HiddenAccounts]: {
        name: `views.settings.${SettingsRoute.HiddenAccounts}.title`,
        category: SettingsCategory.Security,
        enabled: advanced?.[SettingsRoute.HiddenAccounts]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.HiddenAccounts],
        view: HiddenAccountsView,
    },
    [SettingsRoute.DeleteProfile]: {
        name: `views.settings.${SettingsRoute.DeleteProfile}.title`,
        category: SettingsCategory.Security,
        enabled: security?.[SettingsRoute.DeleteProfile]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.DeleteProfile],
        view: DeleteProfileView,
    },
    // Advanced
    [SettingsRoute.NetworkConfiguration]: {
        name: `views.settings.${SettingsRoute.NetworkConfiguration}.title`,
        category: SettingsCategory.Advanced,
        enabled: advanced?.[SettingsRoute.NetworkConfiguration]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.NetworkConfiguration],
        view: NetworkConfigurationRouter,
    },
    [SettingsRoute.WalletFinder]: {
        name: `views.settings.${SettingsRoute.WalletFinder}.title`,
        category: SettingsCategory.Advanced,
        enabled: advanced?.[SettingsRoute.WalletFinder]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.WalletFinder],
        view: WalletFinderView,
    },
    [SettingsRoute.ErrorLog]: {
        name: `views.settings.${SettingsRoute.ErrorLog}.title`,
        category: SettingsCategory.Advanced,
        enabled: advanced?.[SettingsRoute.ErrorLog]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.ErrorLog],
        view: ErrorLogView,
    },
    [SettingsRoute.Diagnostics]: {
        name: `views.settings.${SettingsRoute.Diagnostics}.title`,
        category: SettingsCategory.Advanced,
        enabled: advanced?.[SettingsRoute.Diagnostics]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.Diagnostics],
        view: DiagnosticsView,
    },
    // Help and information
    [SettingsRoute.Documentation]: {
        name: `views.settings.${SettingsRoute.Documentation}.title`,
        category: SettingsCategory.HelpAndInfo,
        enabled: helpAndInfo?.[SettingsRoute.Documentation]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.Documentation],
        external: true,
        url: DOCUMENTATION_URL,
    },
    [SettingsRoute.FAQ]: {
        name: `views.settings.${SettingsRoute.FAQ}.title`,
        category: SettingsCategory.HelpAndInfo,
        enabled: helpAndInfo?.[SettingsRoute.FAQ]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.FAQ],
        external: true,
        url: FAQ_URL,
    },
    [SettingsRoute.Discord]: {
        name: `views.settings.${SettingsRoute.Discord}.title`,
        category: SettingsCategory.HelpAndInfo,
        enabled: helpAndInfo?.[SettingsRoute.Discord]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.Discord],
        external: true,
        url: DISCORD_URL,
    },
    [SettingsRoute.ReportAnIssue]: {
        name: `views.settings.${SettingsRoute.ReportAnIssue}.title`,
        category: SettingsCategory.HelpAndInfo,
        enabled: helpAndInfo?.[SettingsRoute.ReportAnIssue]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.ReportAnIssue],
        external: true,
        url: ISSUE_REPORT_URL,
    },
}
