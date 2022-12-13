import { Icon } from '@lib/auxiliary/icon'
import features from '../../../../features/features'
import { ChangePasswordView } from '../../../../views/dashboard/drawers/profile/views/settings/security'
import { SettingsRoute } from '../../../routers'
import { SettingsCategory } from '../enums'

const { security } = features.settings

export const SETTINGS = {
    [SettingsRoute.ChangePassword]: {
        name: 'views.settings.changePassword.title',
        category: SettingsCategory.Security,
        enabled: security.changePassword.enabled,
        icon: Icon.Lock,
        view: ChangePasswordView,
    },
}
