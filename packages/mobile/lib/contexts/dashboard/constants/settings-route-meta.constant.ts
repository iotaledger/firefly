import { DISCORD_URL, DOCUMENTATION_URL, FAQ_URL, ISSUE_REPORT_URL } from '@contexts/settings'
import { SETTINGS_ICON_SVG } from '@lib/auxiliary/icon'
import features from '../../../../features/features'
import { ChangePasswordView, LanguageView, ThemeView } from '../../../../views/dashboard/drawers/profile/views/settings'
import { SettingsRoute } from '../../../routers'
import { SettingsCategory } from '../enums'

const { general, security, helpAndInfo } = features.settings

export const SETTINGS_ROUTE_META = {
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
    [SettingsRoute.ChangePassword]: {
        name: `views.settings.${SettingsRoute.ChangePassword}.title`,
        category: SettingsCategory.Security,
        enabled: security?.[SettingsRoute.ChangePassword]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.ChangePassword],
        view: ChangePasswordView,
    },
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
