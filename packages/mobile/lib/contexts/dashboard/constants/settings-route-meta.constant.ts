import { SETTINGS_ICON_SVG } from '@lib/auxiliary/icon'
import features from '../../../../features/features'
import { ChangePasswordView, LanguageView, ThemeView } from '../../../../views/dashboard/drawers/profile/views/settings'
import { SettingsRoute } from '../../../routers'
import { SettingsCategory } from '../enums'

const { general, security } = features.settings

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
}
