import { SETTINGS_ICON_SVG } from '@lib/auxiliary/icon'
import features from '../../../../features/features'
import { ChangePasswordView } from '../../../../views/dashboard/drawers/profile/views/settings/security'
import { SettingsRoute } from '../../../routers'
import { SettingsCategory } from '../enums'

const { security } = features.settings

export const SETTINGS_ROUTE_META = {
    [SettingsRoute.ChangePassword]: {
        name: 'views.settings.changePassword.title',
        category: SettingsCategory.Security,
        enabled: security.changePassword.enabled,
        icon: SETTINGS_ICON_SVG[SettingsRoute.ChangePassword],
        view: ChangePasswordView,
    },
}
