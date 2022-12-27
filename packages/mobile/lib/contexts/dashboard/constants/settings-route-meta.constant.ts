import { SETTINGS_ICON_SVG } from '@lib/auxiliary/icon'
import features from '../../../../features/features'
import {
    AppLockView,
    ThemeView,
    ChangePasswordView,
    ErrorLogView,
    LanguageView,
    DiagnosticsView,
    WalletFinderView,
} from '../../../../views/dashboard/drawers/profile/views/settings'
import { SettingsRoute } from '../../../routers'
import { SettingsCategory } from '../enums'

const { general, security, advanced } = features.settings

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
    // Security
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
    [SettingsRoute.ErrorLog]: {
        name: `views.settings.${SettingsRoute.ErrorLog}.title`,
        category: SettingsCategory.Advanced,
        enabled: advanced?.[SettingsRoute.ErrorLog]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.ErrorLog],
        view: ErrorLogView,
    },
    // Advanced
    [SettingsRoute.Diagnostics]: {
        name: `views.settings.${SettingsRoute.Diagnostics}.title`,
        category: SettingsCategory.Advanced,
        enabled: advanced?.[SettingsRoute.Diagnostics]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.Diagnostics],
        view: DiagnosticsView,
    },
    [SettingsRoute.WalletFinder]: {
        name: `views.settings.${SettingsRoute.WalletFinder}.title`,
        category: SettingsCategory.Advanced,
        enabled: advanced?.[SettingsRoute.WalletFinder]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.WalletFinder],
        view: WalletFinderView,
    },
}
