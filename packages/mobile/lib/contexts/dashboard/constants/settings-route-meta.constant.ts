import { SETTINGS_ICON_SVG } from '@lib/auxiliary/icon'
import features from '../../../../features/features'
import { ChangePasswordView } from '../../../../views/dashboard/drawers/profile/views/settings'
import { SettingsRoute } from '../../../routers'
import { SettingsCategory } from '../enums'

const { security } = features.settings

export const SETTINGS_ROUTE_META = {
    [SettingsRoute.ChangePassword]: {
        name: `views.settings.${SettingsRoute.ChangePassword}.title`,
        category: SettingsCategory.Security,
        enabled: security?.[SettingsRoute.ChangePassword]?.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.ChangePassword],
        view: ChangePasswordView,
    },
}
