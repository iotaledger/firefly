import { ChangeProfileName, Currency, DeleteProfile } from './'
import { ProfileSettingsRoute } from '@core/router'

export const PROFILE_SETTINGS = [
    { component: ChangeProfileName, childRoute: ProfileSettingsRoute.ChangeProfileName },
    { component: Currency, childRoute: ProfileSettingsRoute.Currency },
    { component: DeleteProfile, childRoute: ProfileSettingsRoute.DeleteProfile },
]
