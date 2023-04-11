import { AppLock, ChangePassword, ChangePincode, ExportStronghold, StrongholdPasswordTimeout } from './'
import { SecuritySettingsRoute } from '@core/router'

export const SECURITY_SETTINGS = [
    { component: AppLock, childRoute: SecuritySettingsRoute.AppLock },
    {
        component: StrongholdPasswordTimeout,
        childRoute: SecuritySettingsRoute.StrongholdPasswordTimeout,
        requiresSoftwareProfile: true,
    },
    { component: ChangePincode, childRoute: SecuritySettingsRoute.ChangePincode },
    { component: ChangePassword, childRoute: SecuritySettingsRoute.ChangePassword, requiresSoftwareProfile: true },
    { component: ExportStronghold, childRoute: SecuritySettingsRoute.ExportStronghold, requiresSoftwareProfile: true },
]
